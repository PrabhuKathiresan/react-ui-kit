import React, { useState } from 'react'
import { Form, Toast } from '@pk-design/react-ui-kit'
import COUNTRIES from './countries.json'

const { useToasts } = Toast

const FRUITS = [
  {
    label: 'Apple',
    value: 'apple',
    disabled: false
  },
  {
    label: 'Orange',
    value: 'orange'
  },
  {
    label: 'Guava',
    value: 'guava'
  },
  {
    label: 'Mango',
    value: 'mango'
  },
  {
    label: 'Lemon',
    value: 'lemon'
  }
]

const SPORTS = [
  {
    label: 'Cricket',
    value: 'cricket'
  },
  {
    label: 'Football',
    value: 'football'
  },
  {
    label: 'Hockey',
    value: 'hockey'
  },
  {
    label: 'Kabadi',
    value: 'kabadi'
  },
  {
    label: 'Running',
    value: 'running'
  },
  {
    label: 'Swimming',
    value: 'swimming'
  }
]

// eslint-disable-next-line
const FIELDS = [
  {
    name: '_id',
    hidden: true
  },
  {
    name: 'name',
    label: 'Employee name',
    required: true,
    type: 'text',
    hint: 'Enter employee full name'
  },
  {
    name: 'age',
    label: 'Employee age',
    required: true,
    type: 'number',
    min: 18,
    max: 42
  },
  {
    name: 'address',
    label: 'Address',
    required: false,
    type: 'text',
    component: 'TextArea',
    maxLength: 50
  },
  {
    name: 'description',
    label: 'About',
    required: false,
    type: 'text',
    component: 'TextArea',
    maxLength: 50
  },
  {
    name: 'reason',
    label: 'Add some reasons',
    required: false,
    type: 'text',
    component: 'TextArea',
    maxLength: 50
  },
  {
    name: 'country',
    label: 'Country',
    required: true,
    component: 'Select',
    componentProps: {
      options: [...COUNTRIES],
      animate: true,
      searchable: true
    }
  },
  {
    name: 'sports',
    label: 'Favorite sports',
    required: false,
    component: 'Select',
    componentProps: {
      options: [...SPORTS],
      multiple: true,
      animate: true,
      searchable: true,
      labelKey: 'label'
    }
  },
  {
    name: 'fruit',
    label: 'Favourite fruits',
    required: false,
    component: 'Checkbox.Group',
    componentProps: {
      variant: 'column',
      options: [...FRUITS],
    }
  },
  {
    name: 'department',
    label: 'Employee department',
    required: false,
    component: 'Radio.Group',
    componentProps: {
      variant: 'column',
      options: [
        {
          label: 'Engineering',
          value: 'Engineering'
        },
        {
          label: 'Business analyst',
          value: 'ba'
        },
        {
          label: 'Management',
          value: 'management'
        }
      ]
    }
  },
  {
    name: 'agreed',
    component: 'Checkbox',
    componentProps: {
      children: 'I hereby declare that above mentioned informations are true to my knowledge'
    }
  }
]

const BRANDS = [
  {
    name: 'Sakthi masala',
    _id: '1'
  },
  {
    name: 'Harina products',
    _id: '2'
  },
  {
    name: 'TTK products',
    _id: '3'
  },
  {
    name: 'Dolda milk products',
    _id: '4'
  }
]

const roles = [
  {
    name: 'User',
    value: 'user'
  },
  {
    name: 'Admin',
    value: 'admin'
  },
  {
    name: 'Super admin',
    value: 'super_admin'
  }
]

const isSuperAdmin = (role) => role === 'super_admin'
// const isAdmin = (agent) => agent.role === 'admin'

// const isNewForm = agent => isEmpty(agent._id)

const CustomCompoent = (props) => {
  return (
    <div className='mb-16'>
      <div className='mb-2'>
        <label htmlFor={props.id}>{props.label}</label>
        <input type='checkbox' disabled={props.disabled} checked={Boolean(props.value)} id={props.id} onChange={(e) => props.onChange(e.target.checked)} />
      </div>
      {props.error && <span className='text-danger'>{props.error}</span>}
    </div>
  )
}

const CustomTextArea = (props) => {
  return (
    <div className='mb-16'>
      <div className='mb-2'>
        <label htmlFor={props.id}>{props.label}</label>
        <textarea id={props.id} onChange={(e) => props.onChange(e.target.value)} value={props.value} />
      </div>
      {props.error && <span className='text-danger'>{props.error}</span>}
    </div>
  )
}

const AGENT_FIELDS = [
  {
    name: '_id',
    hidden: true,
    editable: false
  },
  {
    name: 'name',
    type: 'text',
    required: true,
    label: 'Agent name',
    autoFocus: true,
    value: '',
    hint: 'Agent name'
  },
  {
    name: 'email',
    type: 'email',
    required: true,
    label: 'Agent email address',
    value: ''
  },
  {
    name: 'password',
    type: 'password',
    label: 'Create password for agent',
    value: '',
    hiddenIf: (agent) => Boolean(agent._id),
    when: [
      ['_id'],
      (_id, schema) => {
        if (_id) return schema.notRequired()

        return schema.required('Password is required')
      }
    ]
  },
  {
    name: 'contact',
    type: 'text',
    label: 'Agent contact number',
    value: ''
  },
  {
    name: 'dob',
    label: 'Date of birth',
    required: true,
    type: 'date',
    component: 'DatePicker',
    min: new Date(1993, 10),
    max: new Date(2000, 0)
  },
  {
    name: 'monthOfJoining',
    label: 'Month joined',
    required: true,
    type: 'date',
    component: 'MonthPicker',
    min: new Date(2000, 0),
    max: new Date()
  },
  {
    name: 'serviceLocation',
    label: 'Last served location',
    type: 'text',
    required: true,
    component: 'Radio.Group',
    componentProps: {
      options: [
        {
          label: 'Chennai',
          value: 'chennai'
        },
        {
          label: 'Bangalore',
          value: 'bangalore'
        },
        {
          label: 'Hyderabad',
          value: 'hyderabad'
        }
      ]
    }
  },
  {
    name: 'role',
    label: 'Agent role',
    hint: 'Role that agent will hold',
    type: 'object',
    component: 'Select',
    componentProps: {
      animate: true,
      placeHolder: 'select agent role...',
      searchable: false,
      options: roles
    },
    required: true,
    transform: function (role) {
      return role?.value || null
    }
  },
  {
    name: 'manageAllBrands',
    subTitle: 'If this is enabled, agent will be able to create/update any invoice/product under any brands',
    type: 'boolean',
    component: 'Checkbox',
    componentProps: {
      children: 'Agent can work with all brands',
      variant: 'bordered'
    },
    value: false,
    disabledIf: (agent) => isSuperAdmin(agent.role?.value)
  },
  {
    name: 'managedBrands',
    label: 'Brands that this agent can work with',
    type: 'array',
    default: null,
    component: 'Select',
    componentProps: {
      placeHolder: 'select brand...',
      searchable: false,
      multiple: true,
      options: [...BRANDS],
      labelKey: 'name'
    },
    transform: function(value) {
      return value.map(v => v._id)
    },
    hiddenIf: (agent) => agent.manageAllBrands,
    when: [
      ['role', 'manageAllBrands'],
      (...data) => {
        let [role, manageAllBrands, schema] = data
        return (manageAllBrands || role?.value === 'super_admin') ? schema.nullable() : schema.min(1, 'Atleast one brand is required')
      }
    ]
  },
  {
    name: 'age',
    label: 'Agent age',
    type: 'number',
    required: true,
    default: null
  },
  {
    name: 'custom',
    label: 'Free text',
    component: 'Custom',
    type: 'text',
    customComponent: CustomTextArea,
    required: true,
    errorMessage: {
      required: 'Please enter some free text'
    }
  },
  {
    name: 'agreeTerms',
    label: 'Accept terms and conditions',
    component: 'Custom',
    type: 'boolean',
    customComponent: CustomCompoent,
    required: true,
    errorMessage: {
      required: 'Please agree terms and conditions'
    },
    disabledIf: (agent) => agent.agreeTerms,
    nullable: true
  },
  {
    name: 'createdAt',
    hidden: true,
    editable: false,
  },
  {
    name: 'updatedAt',
    label: 'Last modified at',
    hidden: true,
    accessor: row => new Date(row.updatedAt).toDateString(),
    useSort: 'updatedAt',
    width: 160,
    sortable: true,
    editable: false,
  }
]

class Service {
  constructor(allowedMethods) {
    this.allowedMethods = allowedMethods
  }

  create(data) {
    return Promise.resolve({ success: true })
  }

  update = async (id, data) => {
    return Promise.resolve({ success: true })
  }
}

const ownProp = (o, prop) => {
  if ('hasOwnProperty' in o) {
    return o.hasOwnProperty(prop)

  } else {
    return Object.prototype.hasOwnProperty.call(o, prop)
  }
}

export default function FormComponent({ stickyFooter = true, onError = () => { }, onSuccess = () => { }, onCancel = () => { } }) {
  const service = new Service(['post', 'put'])
  const toasts = useToasts()
  const [data,] = useState({
    _id: null,
    name: 'Prabhu Kathiresan',
    email: 'prabhukathir30@gmail.com',
    role: null,
    dob: null,
    age: null,
    manageAllBrands: false,
    managedBrands: []
  })

  function handleSuccess() {
    onSuccess()
    toasts.addToast('Agent updated successfully', { title: 'Update success', type: 'success', autoDismiss: true, duration: 5000 })
  }

  function handleError() {
    onError()
    toasts.addToast('Agent updated failed', { title: 'Update failed', type: 'error', autoDismiss: true, duration: 5000 })
  }

  function beforeUpdate(updates) {
    if (ownProp(updates, 'manageAllBrands') && updates.manageAllBrands) {
      updates.managedBrands = []
    }
    if (ownProp(updates, 'role')) {
      updates.manageAllBrands = isSuperAdmin(updates.role.value)
    }
    return updates
  }

  return (
    <Form
      name='agent-form'
      fields={AGENT_FIELDS}
      data={data}
      service={service}
      idField='_id'
      submitBtnText='Save Agent'
      onError={handleError}
      onSuccess={handleSuccess}
      stickyFooter={stickyFooter}
      strict
      showCancelBtn
      onCancel={() => onCancel()}
      beforeUpdate={beforeUpdate}
    />
  )
}
