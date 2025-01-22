import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { AddressAutocomplete } from '../common/AddressAutocomplete';
import { FloatingLabelInput } from '../ui/FloatingLabelInput';
import { FloatingLabelSelect } from '../ui/FloatingLabelSelect';
import { supabase } from '../../lib/supabaseClient';

interface VenueFormProps {
  initialData?: any;
  venueId?: string;
  onSuccess?: () => void;
}

export const VenueForm: React.FC<VenueFormProps> = ({ 
  initialData,
  venueId,
  onSuccess
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'pool',
    address: initialData?.address || '',
    city: initialData?.city || '',
    postal_code: initialData?.postal_code || '',
    country: initialData?.country || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    capacity: initialData?.capacity?.toString() || '',
    lanes: initialData?.lanes?.toString() || '',
    length: initialData?.length?.toString() || '',
    width: initialData?.width?.toString() || '',
    depth_min: initialData?.depth_min?.toString() || '',
    depth_max: initialData?.depth_max?.toString() || '',
    has_diving_boards: initialData?.has_diving_boards ?? false,
    has_timing_system: initialData?.has_timing_system ?? false,
    is_indoor: initialData?.is_indoor ?? true,
    is_accessible: initialData?.is_accessible ?? true,
    notes: initialData?.notes || ''
  });

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    initialData?.coordinates ? {
      lat: initialData.coordinates.coordinates[1],
      lng: initialData.coordinates.coordinates[0]
    } : null
  );

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Venue name is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.postal_code.trim()) {
      errors.postal_code = 'Postal code is required';
    }

    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (formData.website && !/^https?:\/\/.*/.test(formData.website)) {
      errors.website = 'Website must start with http:// or https://';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressSelect = (addressData: {
    formatted: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.street,
      city: addressData.city,
      postal_code: addressData.postalCode,
      country: addressData.country
    }));
    setCoordinates(addressData.coordinates);
    
    // Clear any existing address-related errors
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.address;
      delete newErrors.city;
      delete newErrors.postal_code;
      delete newErrors.country;
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const venueData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        lanes: formData.lanes ? parseInt(formData.lanes) : null,
        length: formData.length ? parseInt(formData.length) : null,
        width: formData.width ? parseInt(formData.width) : null,
        depth_min: formData.depth_min ? parseFloat(formData.depth_min) : null,
        depth_max: formData.depth_max ? parseFloat(formData.depth_max) : null,
        coordinates: coordinates 
          ? `POINT(${coordinates.lng} ${coordinates.lat})`
          : null
      };

      if (venueId) {
        const { error } = await supabase
          .from('venues')
          .update(venueData)
          .eq('id', venueId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('venues')
          .insert([venueData]);

        if (error) throw error;
      }

      onSuccess?.();
      navigate('/venues');
    } catch (error) {
      console.error('Error saving venue:', error);
      setFormErrors(prev => ({
        ...prev,
        submit: 'Error saving venue. Please try again.'
      }));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear error for the field being changed
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formErrors.submit && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-600 dark:text-red-400">
          {formErrors.submit}
        </div>
      )}

      {/* Basic Information */}
      <Card title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingLabelInput
            id="name"
            name="name"
            label="Venue Name"
            required
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name}
          />
          <FloatingLabelSelect
            id="type"
            name="type"
            label="Venue Type"
            value={formData.type}
            onChange={handleChange}
            options={[
              { value: 'pool', label: 'Swimming Pool' },
              { value: 'complex', label: 'Sports Complex' },
              { value: 'other', label: 'Other' }
            ]}
          />
        </div>
      </Card>

      {/* Location */}
      <Card title="Location">
        <div className="space-y-6">
          <AddressAutocomplete
            value={formData.address}
            onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
            onAddressSelect={handleAddressSelect}
            required
            error={formErrors.address}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingLabelInput
              id="city"
              name="city"
              label="City"
              required
              value={formData.city}
              onChange={handleChange}
              error={formErrors.city}
            />
            <FloatingLabelInput
              id="postal_code"
              name="postal_code"
              label="Postal Code"
              required
              value={formData.postal_code}
              onChange={handleChange}
              error={formErrors.postal_code}
            />
            <FloatingLabelInput
              id="country"
              name="country"
              label="Country"
              required
              value={formData.country}
              onChange={handleChange}
              error={formErrors.country}
            />
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingLabelInput
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            error={formErrors.phone}
          />
          <FloatingLabelInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
          />
          <div className="md:col-span-2">
            <FloatingLabelInput
              id="website"
              name="website"
              type="url"
              label="Website"
              value={formData.website}
              onChange={handleChange}
              error={formErrors.website}
            />
          </div>
        </div>
      </Card>

      {/* Pool Specifications */}
      <Card title="Pool Specifications">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FloatingLabelInput
            id="capacity"
            name="capacity"
            type="number"
            label="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            error={formErrors.capacity}
          />
          <FloatingLabelInput
            id="lanes"
            name="lanes"
            type="number"
            label="Number of Lanes"
            value={formData.lanes}
            onChange={handleChange}
            error={formErrors.lanes}
          />
          <FloatingLabelInput
            id="length"
            name="length"
            type="number"
            label="Length (meters)"
            value={formData.length}
            onChange={handleChange}
            error={formErrors.length}
          />
          <FloatingLabelInput
            id="width"
            name="width"
            type="number"
            label="Width (meters)"
            value={formData.width}
            onChange={handleChange}
            error={formErrors.width}
          />
          <FloatingLabelInput
            id="depth_min"
            name="depth_min"
            type="number"
            step="0.1"
            label="Minimum Depth (meters)"
            value={formData.depth_min}
            onChange={handleChange}
            error={formErrors.depth_min}
          />
          <FloatingLabelInput
            id="depth_max"
            name="depth_max"
            type="number"
            step="0.1"
            label="Maximum Depth (meters)"
            value={formData.depth_max}
            onChange={handleChange}
            error={formErrors.depth_max}
          />
        </div>
      </Card>

      {/* Features */}
      <Card title="Features">
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="has_diving_boards"
                checked={formData.has_diving_boards}
                onChange={handleChange}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Diving Boards</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="has_timing_system"
                checked={formData.has_timing_system}
                onChange={handleChange}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Electronic Timing System</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_indoor"
                checked={formData.is_indoor}
                onChange={handleChange}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Indoor Facility</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_accessible"
                checked={formData.is_accessible}
                onChange={handleChange}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Accessible Facility</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Additional Notes */}
      <Card title="Additional Notes">
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate('/venues')}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : venueId ? 'Save Changes' : 'Create Venue'}
        </button>
      </div>
    </form>
  );
};
