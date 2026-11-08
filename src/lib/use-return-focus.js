import * as React from 'react';

// Set while a dialog unmounts, for a dialog that opens in the same render.
let handedOver = null;

// The element to go back to: a menu item is gone once its menu closes, so its menu's button instead.
function opener(element) {
  if (!element || element === document.body) {
    return null;
  }
  const menu = element.closest('[role="menu"]');
  return (menu && document.getElementById(menu.getAttribute('aria-labelledby'))) || element;
}

/**
 * Radix returns focus to a dialog's Trigger when it closes, so a dialog opened from state, or from a
 * DropdownMenu item, would leave focus on <body>. This returns it to whatever had focus when the
 * dialog opened. The caller's own handlers run first and can still preventDefault.
 */
export function useReturnFocus({ onOpenAutoFocus, onCloseAutoFocus }) {
  const returnTo = React.useRef(null);

  // A dialog replaced by another in one render (a form, then its result) leaves nothing focused for the
  // new one to remember. React runs this cleanup before the new dialog's mount effects, so it can pass
  // its own target on.
  React.useEffect(
    () => () => {
      if (returnTo.current?.isConnected) {
        handedOver = returnTo.current;
        queueMicrotask(() => {
          handedOver = null;
        });
      }
    },
    []
  );

  return {
    onOpenAutoFocus: (event) => {
      returnTo.current = opener(document.activeElement) ?? handedOver;
      onOpenAutoFocus?.(event);
    },
    onCloseAutoFocus: (event) => {
      onCloseAutoFocus?.(event);
      const target = returnTo.current;
      if (event.defaultPrevented || !target?.isConnected) {
        return;
      }
      event.preventDefault();
      // Not out of a dialog that has opened in this one's place.
      if (!document.activeElement?.closest('[role="dialog"], [role="alertdialog"]')) {
        target.focus();
      }
    }
  };
}
