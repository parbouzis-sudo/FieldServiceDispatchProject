import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { customerSchema, type CustomerInput } from '@/lib/validators';
import { useCreateCustomer, useUpdateCustomer } from '../hooks/use-customers';
import type { Customer } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CustomerFormProps {
  customer?: Customer; // If provided, we're editing
}

export function CustomerForm({ customer }: CustomerFormProps) {
  const navigate = useNavigate();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const isEditing = !!customer;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer
      ? {
          type: customer.type,
          companyName: customer.companyName ?? '',
          firstName: customer.firstName ?? '',
          lastName: customer.lastName ?? '',
          email: customer.email ?? '',
          phone: customer.phone ?? '',
          secondaryPhone: customer.secondaryPhone ?? '',
          notes: customer.notes ?? '',
          source: customer.source ?? '',
          tags: customer.tags,
        }
      : {
          type: 'commercial',
          tags: [],
        },
  });

  const customerType = watch('type');

  const onSubmit = async (data: CustomerInput) => {
    if (isEditing && customer) {
      await updateMutation.mutateAsync({ id: customer.id, input: data });
      navigate({ to: '/customers/$customerId', params: { customerId: customer.id } });
    } else {
      const newCustomer = await createMutation.mutateAsync(data);
      navigate({ to: '/customers/$customerId', params: { customerId: newCustomer.id } });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Edit Customer' : 'New Customer'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? `Update details for ${customer.displayName}`
            : 'Add a new customer to your account.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {(['commercial', 'residential'] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={type}
                    {...register('type')}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium capitalize">{type}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customerType === 'commercial' && (
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" {...register('companyName')} />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName.message}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name {customerType === 'residential' ? '*' : ''}
                </Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register('lastName')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                <Input id="secondaryPhone" {...register('secondaryPhone')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source">How did they find us?</Label>
              <Input
                id="source"
                placeholder="Referral, Google, Website..."
                {...register('source')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any relevant details about this customer..."
                {...register('notes')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/customers' })}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? 'Saving...'
                : 'Creating...'
              : isEditing
                ? 'Save Changes'
                : 'Create Customer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
