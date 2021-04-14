import React from 'react'
import { Form, Toast } from '@pk-design/react-ui-kit'
import { isEmpty } from 'lodash'
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

const isSuperAdmin = (agent) => agent.role === 'super_admin'
// const isAdmin = (agent) => agent.role === 'admin'

const isNewForm = agent => isEmpty(agent._id)

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
    value: ''
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
    dependencyCheck: {
      validate: (value, options, agent) => { // eslint-disable
        return !isNewForm(agent) || !isEmpty(value);
      },
      errorMessage: 'Password is required'
    }
  },
  {
    name: 'contact',
    type: 'text',
    label: 'Agent contact number',
    value: ''
  },
  {
    name: 'role',
    label: 'Agent role',
    type: 'text',
    component: 'Select',
    componentProps: {
      animate: true,
      placeHolder: 'select agent role...',
      searchable: false,
      options: roles
    },
    required: true,
    valueFormatter: function (val) {
      if (!val) return '';
      let role = [...roles].filter(r => r.value === val);
      return role && role[0] ? role[0] : '';
    },
    formatter: function (role) {
      return role[0]?.value || '';
    },
    onInputChange: (agent) => {
      let updates = {
        type: 'update',
        manageAllBrands: false
      };
      if (isSuperAdmin(agent)) {
        updates.manageAllBrands = true
      }
      return updates
    }
  },
  {
    name: 'manageAllBrands',
    // label: 'Agent can work with all brands',
    subTitle: 'If this is enabled, agent will be able to create/update any invoice/product under any brands',
    type: 'boolean',
    component: 'Checkbox',
    componentProps: {
      children: 'Agent can work with all brands',
      variant: 'bordered'
    },
    value: false,
    disabledIf: (agent) => isSuperAdmin(agent),
    onInputChange: (agent) => {
      let updates = {
        type: 'update',
        managedBrands: [...agent.managedBrands]
      };
      if (agent.manageAllBrands) {
        updates.managedBrands = []
      }
      return updates
    }
  },
  {
    name: 'managedBrands',
    label: 'Brands that this agent can work with',
    type: 'text',
    component: 'Select',
    componentProps: {
      placeHolder: 'select brand...',
      searchable: false,
      multiple: true,
      options: [...BRANDS],
      labelKey: 'name'
    },
    requiredIf: (...args) => {
      let [, ,agent] = args
      return isSuperAdmin(agent) || agent.manageAllBrands || !isEmpty(agent.managedBrands)
    },
    formatter: function (value) {
      if (value && Array.isArray(value)) {
        return value.map(v => v._id);
      }
      return [];
    },
    hiddenIf: (agent) => agent.manageAllBrands,
    dependencyCheck: {
      validate: (value, options, agent) => { // eslint-disable
        return agent.manageAllBrands || !isEmpty(value);
      },
      errorMessage: 'Atleast one brand is required'
    }
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
    console.log(this.allowedMethods);
    return Promise.resolve({ success: true });
  }

  update = (id, data) => {
    console.log(this.allowedMethods);
    return Promise.resolve({ success: true });
  }
}

export default function FormComponent({ stickyFooter = true, onError = () => {}, onSuccess = () => {}, onCancel = () => {} }) {
  const service = new Service(['post', 'put']);
  const toasts = useToasts();
  const data = {
    _id: 1,
    name: 'Prabhu Kathiresan',
    email: 'prabhukathir30@gmail.com',
    role: {
      name: 'Admin',
      value: 'admin'
    },
    manageAllBrands: true,
    managedBrands: []
  }

  function handleSuccess() {
    onSuccess()
    toasts.addToast('Agent updated successfully', { title: 'Update success', type: 'success', autoDismiss: true, duration: 5000 })
  }

  function handleError() {
    onError()
    toasts.addToast('Agent updated failed', { title: 'Update failed', type: 'error', autoDismiss: true, duration: 5000 })
  }

  return (
    <Form
      name='agent-form'
      fields={AGENT_FIELDS}
      data={data}
      service={service}
      isNewForm={false}
      dataId={1}
      submitBtnText='Save Agent'
      onError={handleError}
      onSuccess={handleSuccess}
      stickyFooter={stickyFooter}
      strict
      showCancelBtn
      onCancel={() => onCancel()}
    />
  )
}
