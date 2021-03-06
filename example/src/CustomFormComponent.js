import React from 'react'
import { Form } from '@pk-design/react-ui-kit';
import { map, isEmpty, isNumber } from 'lodash'

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
    type: 'text'
  },
  {
    name: 'price',
    label: 'Unit price',
    placeholder: 'enter unit price',
    type: 'number',
    required: true,
  },
  {
    name: 'mrp',
    label: 'MRP',
    placeholder: 'enter mrp',
    type: 'number',
  },
  {
    name: 'quantity',
    label: 'Stock available',
    placeholder: 'enter quantity available',
    type: 'number',
  },
  {
    name: 'gst',
    label: 'Tax rate',
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
    formatter: function (value) {
      return value[0] ? value[0].key : '';
    },
    required: true
  },
  {
    name: 'unit',
    label: 'UOM',
    type: 'text',
    component: 'Select',
    componentProps: {
      animate: true,
      placeHolder: 'select unit of measurement',
      searchable: false,
      options: UNITS,
      labelKey: 'name'
    },
    formatter: function (value) {
      return value[0] ? value[0]._id : '';
    },
    required: true
  }
]

export default function CustomFormComponent() {
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
      isValid: false
    };
    for (let field in data) {
      let value = data[field];
      if (!isEmpty(value) || isNumber(value)) {
        validation.isValid = true;
        validation.genericError = '';
        break;
      }
    }
    return validation;
  };

  let service = {
    post: (data) => {
      return Promise.resolve({});
    }
  };

  return (
    <div>
      <Form
        customValidation={validateData}
        constructParams={constructFormData}
        fields={FIELDS}
        data={{}}
        isNewForm
        service={service}
      />
    </div>
  )
}
