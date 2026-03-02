import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus, Search, Building2, User } from 'lucide-react';
import { useCustomers } from '../hooks/use-customers';
import type { CustomerFilters } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatPhone, formatRelative } from '@/lib/utils';

export function CustomerListPage() {
  const [filters, setFilters] = useState<CustomerFilters>({ isActive: true });
  const [searchInput, setSearchInput] = useState('');
  const { data: customers, isLoading, error } = useCustomers(filters);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    // Debounce would go here in production — for now, search on each keystroke
    setFilters((prev) => ({ ...prev, search: value || undefined }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your residential and commercial customers.
          </p>
        </div>
        <Link to="/customers/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'commercial', 'residential'] as const).map((type) => (
            <Button
              key={type}
              variant={
                (filters.type ?? 'all') === type ? 'default' : 'outline'
              }
              size="sm"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  type: type === 'all' ? undefined : type,
                }))
              }
            >
              {type === 'all' ? 'All' : type === 'commercial' ? 'Commercial' : 'Residential'}
            </Button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load customers: {error.message}
        </div>
      )}

      {customers && customers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No customers yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by adding your first customer.
            </p>
            <Link to="/customers/new" className="mt-4">
              <Button>
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {customers && customers.length > 0 && (
        <div className="grid gap-3">
          {customers.map((customer) => (
            <Link
              key={customer.id}
              to="/customers/$customerId"
              params={{ customerId: customer.id }}
            >
              <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    {customer.type === 'commercial' ? (
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{customer.displayName}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {customer.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {customer.email && <span>{customer.email}</span>}
                      {customer.phone && <span>{formatPhone(customer.phone)}</span>}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="hidden md:flex items-center gap-1">
                    {customer.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Created */}
                  <span className="hidden lg:block text-sm text-muted-foreground whitespace-nowrap">
                    {formatRelative(customer.createdAt)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Users(props: { className?: string }) {
  return <User {...props} />;
}
