import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus, Search, Building2, MapPin } from 'lucide-react';
import { useProperties } from '../hooks/use-properties';
import type { PropertyFilters } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PROPERTY_TYPE_LABELS } from '@/lib/constants';

export function PropertyListPage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const { data: properties, isLoading, error } = useProperties(filters);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, search: value || undefined }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage service locations and equipment.</p>
        </div>
        <Link to="/properties/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load properties: {error.message}
        </div>
      )}

      {properties && properties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No properties yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a property to start tracking service locations.
            </p>
            <Link to="/properties/new" className="mt-4">
              <Button>
                <Plus className="h-4 w-4" />
                Add Property
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {properties && properties.length > 0 && (
        <div className="grid gap-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              to="/properties/$propertyId"
              params={{ propertyId: property.id }}
            >
              <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {property.name || property.addressLine1}
                      </span>
                      {property.propertyType && (
                        <Badge variant="outline" className="text-xs">
                          {PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {property.fullAddress}
                    </div>
                  </div>
                  {property.customerDisplayName && (
                    <span className="hidden md:block text-sm text-muted-foreground">
                      {property.customerDisplayName}
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
