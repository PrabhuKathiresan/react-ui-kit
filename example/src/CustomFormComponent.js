import React from 'react'
import { Form, Toast } from '@pk-design/react-ui-kit';
import { map, isEmpty, isNumber } from 'lodash'

const { useToasts } = Toast;

export const GST_RATES = [
  {
    name: '0',
    key: 0
  },
  {
    name: '5',
    key: 5
  },
  {
    name: '12',
    key: 12
  },
  {
    name: '18',
    key: 18
  },
  {
    name: '28',
    key: 28
  }
];

export const UNITS = [
  {
    name: 'Box',
    _id: '1'
  },
  {
    name: 'Kilogram',
    _id: '2'
  },
  {
    name: 'Meters',
    _id: '3'
  }
]

const FIELDS = [
  {
    name: 'hsncode',
    label: 'Hsn code',
    placeholder: 'enter hsncode',
    required: true,
    type: 'text',
    default: ''
  },
  {
    name: 'price',
    label: 'Unit price',
    placeholder: 'enter unit price',
    type: 'number',
    required: true,
    default: ''
  },
  {
    name: 'mrp',
    label: 'MRP',
    placeholder: 'enter mrp',
    type: 'number',
    default: ''
  },
  {
    name: 'quantity',
    label: 'Stock available',
    placeholder: 'enter quantity available',
    type: 'number',
    default: ''
  },
  {
    name: 'gst',
    label: 'Tax rate',
    type: 'object',
    component: 'Select',
    componentProps: {
      options: GST_RATES,
      labelKey: 'name',
      searchable: false,
      animate: true,
      placeHolder: 'select product tax rate',
      icons: {
        left: <span className='w-100 text-center'>%</span>
      }
    },
    transform: function (value) {
      return value?.key || null;
    },
    required: true,
    default: null
  },
  {
    name: 'unit',
    label: 'UOM',
    type: 'object',
    component: 'Select',
    componentProps: {
      animate: true,
      placeHolder: 'select unit of measurement',
      searchable: false,
      options: UNITS,
      labelKey: 'name'
    },
    transform: function (value) {
      return value?._id || null;
    },
    required: true,
    default: null
  }
]

export default function CustomFormComponent() {
  const toasts = useToasts();
  let products = [
    {
      _id: '1',
      name: 'Product 1'
    },
    {
      _id: '2',
      name: 'Product 2'
    },
    {
      _id: '3',
      name: 'Product 3'
    },
    {
      _id: '4',
      name: 'Product 4'
    }
  ]
  let constructFormData = (data) => ({ type: 'SINGLE_VALUED_BULK_UPDATE', ids: map(products, '_id'), updates: data });

  let validateData = (data) => {
    let validation = {
      errors: {},
      genericError: 'Requires atleast one field to update products',
      isValid: true
    };
    for (let field of ['hsncode', 'price', 'gst', 'unit']) {
      let value = data[field];
      if (isEmpty(value) && !isNumber(value)) {
        validation.isValid = false;
        validation.genericError = `${field} is required`;
        break;
      }
    }
    return validation;
  };

  let service = {
    post: (_data) => {
      return Promise.resolve({});
    }
  };

  return (
    <div>
      <Form
        name='custom-form'
        customValidation={validateData}
        constructParams={constructFormData}
        fields={FIELDS}
        data={{}}
        isNewForm
        service={service}
        createMethod='post'
        abortEarly={false}
        onSuccess={() => toasts.addToast('Custom form saved successfully')}
      />
    </div>
  )
}
