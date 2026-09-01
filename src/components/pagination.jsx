import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../lib/utils.js';
import { Button } from './button.jsx';

const Pagination = React.forwardRef(({ className, ...props }, ref) => (
  <nav ref={ref} aria-label="pagination" className={cn('flex items-center gap-2', className)} {...props} />
));
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn(className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

const PaginationPrevious = ({ className, ...props }) => (
  <Button variant="outline" size="icon" aria-label="Go to previous page" className={cn(className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
  </Button>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }) => (
  <Button variant="outline" size="icon" aria-label="Go to next page" className={cn(className)} {...props}>
    <ChevronRight className="h-4 w-4" />
  </Button>
);
PaginationNext.displayName = 'PaginationNext';

export { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext };
