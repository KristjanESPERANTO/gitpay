import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'

import {
  Link,
  Paper,
  Typography,
  AppBar,
  Avatar,
  Chip,
  Tabs,
  Tab,
  withStyles
} from '@material-ui/core'
import {
  Redeem as RedeemIcon,
  MonetizationOn as MoneyIcon,
  SupervisedUserCircle as ContributionIcon
} from '@material-ui/icons'

import CustomPaginationActionsTable from './task-table'

const styles = theme => ({
  icon: {
    backgroundColor: 'black'
  },
  card: {},
  gutterLeft: {
    marginLeft: 10
  },
  media: {
    width: 600
  },
  rootTabs: {
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.primary.light
  }
})

const messages = defineMessages({
  allTasks: {
    id: 'task.list.lable.allPublicTasks',
    defaultMessage: 'All public issues available'
  },
  allPublicTasksWithBounties: {
    id: 'task.list.lable.allPublicTasksWithBounties',
    defaultMessage: 'Issues with bounties'
  },
  allPublicTasksNoBounties: {
    id: 'task.list.lable.allPublicTasksNoBounties',
    defaultMessage: 'Issues for contribution'
  },
  assignedToMeTasks: {
    id: 'task.status.assigned',
    defaultMessage: 'Assigned to me'
  }
})

class TaskList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 0,
      loading: true,
      project: {}
    }
  }

  filterTasksByState () {
    const currentTab = this.state.tab

    switch (currentTab) {
      case 0:
        this.props.filterTasks('status', 'open')
        break
      case 1:
        this.props.filterTasks('issuesWithBounties')
        break
      case 2:
        this.props.filterTasks('contribution')
        break
      default:
    }
  }

  async componentDidMount () {
    const projectId = this.props.match.params.project_id
    if (projectId) {
      await this.props.fetchProject(
        projectId,
        { status: 'open' }
      )
    }
    else {
      await this.props.listTasks({ status: 'open' })
    }
    const params = this.props.match.params
    this.handleRoutePath(params.filter)
    params.project_id && params.organization_id && this.setState({ project: params })
    this.setState({ loading: false })
    await this.props.listProjects()
    this.filterTasksByState()
  }

  goToProject = (e, project) => {
    e.preventDefault()
    window.location.href = '/#/organizations/' + project.OrganizationId + '/projects/' + project.id
    window.location.reload()
  }

  handleRoutePath = (value) => {
    switch (value) {
      case 'explore':
        this.handleTabChange(0, 0)
        break
      case 'createdbyme':
        this.handleTabChange(0, 1)
        break
      case 'interested':
        this.handleTabChange(0, 2)
        break
      case 'assignedtome':
        this.handleTabChange(0, 3)
        break
      default:
    }
  }

  handleTabChange = (event, value) => {
    const baseUrl = this.state.project && this.state.project.organization_id && this.state.project.project_id ? '/organizations/' + this.state.project.organization_id + '/projects/' + this.state.project.project_id + '/' : '/tasks/'
    this.setState({ tab: value })
    switch (value) {
      case 0:
        this.props.history.push(baseUrl + 'open')
        this.props.filterTasks('status', 'open')
        break
      case 1:
        this.props.history.push(baseUrl + 'withBounties')
        this.props.filterTasks('issuesWithBounties')
        break
      case 2:
        this.props.history.push(baseUrl + 'contribution')
        this.props.filterTasks('contribution')
        break
      default:
        this.props.filterTasks('all')
    }
  }

  render () {
    const { classes } = this.props
    const TabContainer = props => {
      return (
        <Typography component='div' style={ { padding: 8 * 3 } }>
          { props.children }
        </Typography>
      )
    }

    return (
      <Paper elevation={ 0 }>
        { this.props.project.data.name && (
          <Link href='/' onClick={ (e) => {
            e.preventDefault()
            window.location.href = '/#/tasks/all'
            window.location.reload()
          } }>
            <Typography component='p' style={ { marginBottom: 10 } }>
              <FormattedMessage
                id='task.list.link.back'
                defaultMessage='back to all issues'
              />
            </Typography>
          </Link>
        ) }
        <Typography variant='h5' component='h2' style={ { marginTop: 20 } }>
          <FormattedMessage
            id='task.list.headline'
            defaultMessage='Project'
          />
        </Typography>
        { this.props.projects && !this.props.project.data.name && (
          this.props.projects.data.slice(0, 10).map(p => {
            return (
              p.Tasks.length &&
                <Chip
                  deleteIcon={ <Avatar>{ p.Tasks.length }</Avatar> }
                  onDelete={ () => {} }
                  label={ p.name }
                  style={ { marginRight: 10, marginTop: 10, marginBottom: 10 } }
                  size={ 'medium' }
                  onClick={ (e) => this.goToProject(e, p) }
                />
            )
          })
        ) }
        <Typography variant='h3' component='h2'>
          { this.props.project.data.name }
        </Typography>
        <Typography component='p' style={ { marginBottom: 20, marginTop: 20 } }>
          <FormattedMessage
            id='task.list.description'
            defaultMessage='Available issues'
          />
        </Typography>
        <div className={ classes.rootTabs }>
          <AppBar position='static' color='default'>
            <Tabs
              value={ this.state.tab }
              onChange={ this.handleTabChange }
              scrollable
              scrollButtons='on'
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab
                value={ 0 }
                label={ this.props.intl.formatMessage(messages.allTasks) }
                icon={ <RedeemIcon /> }
              />
              <Tab
                value={ 1 }
                label={ this.props.intl.formatMessage(messages.allPublicTasksWithBounties) }
                icon={ <MoneyIcon /> }
              />
              <Tab
                value={ 2 }
                label={ this.props.intl.formatMessage(messages.allPublicTasksNoBounties) }
                icon={ <ContributionIcon /> }
              />
            </Tabs>
          </AppBar>
          <TabContainer>
            <CustomPaginationActionsTable tasks={ this.props.tasks } />
          </TabContainer>
        </div>
      </Paper>
    )
  }
}

TaskList.propTypes = {
  classes: PropTypes.object.isRequired,
  listTasks: PropTypes.func,
  filterTasks: PropTypes.func,
  tasks: PropTypes.object,
  project: PropTypes.object
}

export default injectIntl(withRouter(withStyles(styles)(TaskList)))
