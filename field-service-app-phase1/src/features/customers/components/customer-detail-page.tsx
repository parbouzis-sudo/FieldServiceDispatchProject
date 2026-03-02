import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, Edit, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { useCustomer } from '../hooks/use-customers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPhone, formatDate } from '@/lib/utils';

export function CustomerDetailPage() {
  const { customerId } = useParams({ from: '/authenticated/customers/$customerId' });
  const { data: customer, isLoading, error } = useCustomer(customerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading customer...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Failed to load customer: ${error.message}` : 'Customer not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/customers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{customer.displayName}</h1>
              <Badge variant="outline" className="capitalize">
                {customer.type}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Customer since {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
        <Link
          to="/customers/$customerId/edit"
          params={{ customerId: customer.id }}
        >
          <Button variant="outline">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${customer.email}`} className="hover:underline">
                  {customer.email}
                </a>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${customer.phone}`} className="hover:underline">
                  {formatPhone(customer.phone)}
                </a>
              </div>
            )}
            {customer.billingAddress && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  {customer.billingAddress.street && <div>{customer.billingAddress.street}</div>}
                  {customer.billingAddress.city && (
                    <div>
                      {customer.billingAddress.city}, {customer.billingAddress.state}{' '}
                      {customer.billingAddress.zip}
                    </div>
                  )}
                </div>
              </div>
            )}
            {customer.source && (
              <div className="text-sm text-muted-foreground">
                Source: {customer.source}
              </div>
            )}
            {customer.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {customer.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Properties */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Properties</CardTitle>
            <Link
              to="/properties/new"
              search={{ customerId: customer.id }}
            >
              <Button size="sm">
                <Building2 className="h-4 w-4" />
                Add Property
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Properties for this customer will appear here. Navigate to Properties to manage service locations.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {customer.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
