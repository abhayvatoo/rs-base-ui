import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { SearchIcon, XIcon } from 'lucide-react';

import { cn } from '../lib/utils.js';

// The matched part of `text` in bold, for option labels. Case-insensitive, first match only.
function ComboboxHighlight({ text, query }) {
  const needle = (query ?? '').trim().toLowerCase();
  const index = needle ? text.toLowerCase().indexOf(needle) : -1;
  if (index < 0) {
    return text;
  }
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent font-semibold text-inherit">{text.slice(index, index + needle.length)}</mark>
      {text.slice(index + needle.length)}
    </>
  );
}

/**
 * A search box with a list of options that opens under it (the WAI-ARIA combobox pattern, list
 * autocomplete). Focus stays in the input: the arrow keys move the highlight, Enter picks,
 * Escape closes, × clears. Once picked, the item's label is the input's text; focusing it
 * selects that text, so typing starts a new search. Leaving without picking puts the label back.
 *
 * The caller owns the options: filter `items` itself, locally or from a server call made in
 * `onInputValueChange` (with `loading` set meanwhile). Items can be any objects:
 * - `itemToString(item)`: the label shown in the input once picked (required).
 * - `itemKey(item)`: a unique key (defaults to the label).
 * - `renderItem(item, { query })`: how an option looks (defaults to its label, match in bold).
 * `message` replaces the list (e.g. "Type at least 2 letters"); `emptyMessage` shows when
 * there's text but no `items`.
 */
const Combobox = React.forwardRef(function Combobox(
  {
    id,
    items = [],
    value = null,
    onValueChange,
    onInputValueChange,
    itemToString,
    itemKey = itemToString,
    renderItem,
    loading = false,
    loadingMessage = 'Searching…',
    message,
    emptyMessage = 'No results.',
    placeholder,
    disabled,
    className,
    'aria-label': ariaLabel
  },
  ref
) {
  const label = value ? itemToString(value) : '';
  const [inputValue, setInputValue] = React.useState(label);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  // Follow `value` when the caller changes it (e.g. clears it): adjusting state while rendering.
  const [shownValue, setShownValue] = React.useState(value);
  if (value !== shownValue) {
    setShownValue(value);
    setInputValue(label);
  }

  const anchorRef = React.useRef(null);
  const inputRef = React.useRef(null);
  // A click focuses, then its mouseup would undo the select-all done on focus.
  const keepSelectionRef = React.useRef(false);
  const setInputRef = (node) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };
  const baseId = React.useId();
  const listId = `${baseId}-list`;
  const optionId = (index) => `${baseId}-option-${index}`;

  const active = Math.min(activeIndex, items.length - 1);
  const typed = inputValue.trim() !== '' && inputValue !== label;
  let status = null;
  if (message) status = message;
  else if (loading) status = loadingMessage;
  else if (items.length === 0 && typed) status = emptyMessage;
  const showList = open && !disabled && (status !== null || items.length > 0);

  React.useEffect(() => {
    if (showList && active >= 0) {
      document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' });
    }
  });

  const changeText = (text) => {
    setInputValue(text);
    setActiveIndex(0);
    setOpen(true);
    onInputValueChange?.(text);
  };

  const pick = (item) => {
    setOpen(false);
    setInputValue(itemToString(item));
    onValueChange?.(item);
    // Focus is still in the input: typing straight away starts a new search, not appends.
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const clear = () => {
    setOpen(false);
    setInputValue('');
    onInputValueChange?.('');
    onValueChange?.(null);
    inputRef.current?.focus();
  };

  const onKeyDown = (event) => {
    const count = items.length;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (count > 0) {
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex((Math.max(active, 0) + step + count) % count);
      }
    } else if (event.key === 'Enter' && showList && active >= 0 && status === null) {
      event.preventDefault();
      pick(items[active]);
    } else if (event.key === 'Escape') {
      if (showList) {
        event.preventDefault();
        setOpen(false);
      } else if (inputValue !== label) {
        setInputValue(label);
      }
    }
  };

  return (
    <PopoverPrimitive.Root open={showList} onOpenChange={(next) => !next && setOpen(false)}>
      <PopoverPrimitive.Anchor asChild>
        <div ref={anchorRef} className={cn('relative', className)}>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={setInputRef}
            id={id}
            type="text"
            role="combobox"
            aria-label={ariaLabel}
            aria-autocomplete="list"
            aria-expanded={showList}
            aria-controls={listId}
            aria-activedescendant={showList && status === null && active >= 0 ? optionId(active) : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            disabled={disabled}
            value={inputValue}
            onChange={(event) => changeText(event.target.value)}
            onKeyDown={onKeyDown}
            onFocus={(event) => {
              event.target.select();
              keepSelectionRef.current = true;
            }}
            onMouseUp={(event) => {
              if (keepSelectionRef.current) event.preventDefault();
              keepSelectionRef.current = false;
            }}
            onBlur={() => {
              setOpen(false);
              setInputValue(label);
            }}
            className="flex h-9 w-full rounded-md border border-input bg-background py-1 pr-8 pl-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          {inputValue && !disabled && (
            <button
              type="button"
              aria-label="Clear"
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              onClick={clear}
              className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </PopoverPrimitive.Anchor>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            if (anchorRef.current?.contains(event.target)) event.preventDefault();
          }}
          // Clicks in the list (scrollbar included) must not take focus from the input.
          onMouseDown={(event) => event.preventDefault()}
          className="z-50 max-h-72 w-(--radix-popover-trigger-width) overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          {status !== null ? (
            <div role="status" className="px-2 py-1.5 text-sm text-muted-foreground">
              {status}
            </div>
          ) : (
            <ul id={listId} role="listbox" aria-label={ariaLabel}>
              {items.map((item, index) => (
                <li
                  key={itemKey(item)}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === active}
                  onClick={() => pick(item)}
                  onMouseMove={() => index !== active && setActiveIndex(index)}
                  className={cn(
                    'cursor-default rounded-sm px-2 py-1.5 text-sm select-none',
                    index === active && 'bg-accent text-accent-foreground'
                  )}
                >
                  {renderItem ? (
                    renderItem(item, { query: inputValue })
                  ) : (
                    <ComboboxHighlight text={itemToString(item)} query={inputValue} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});

export { Combobox, ComboboxHighlight };
