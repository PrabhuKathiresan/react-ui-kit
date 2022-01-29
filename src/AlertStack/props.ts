import { Alert } from '../Alert/props'

export interface AlertStackProps {
  placement?: 'top' | 'bottom',
  onDismiss?: Function
  onNavigation?: Function
  alerts: Array<Alert>
  className?: string
  banner?: boolean
  offset?: number
}
