// @todo move this per module
module.exports = {
  dashboard: {
    url: '/desk',
    label: 'Dashboard',
  },
  page: {
    url: '/desk/page',
    label: 'Pages',
  },
  file: {
    url: '/desk/file',
    label: 'Files',
  },
  user: {
    url: '#',
    label: 'User',
    children: {
      users: {
          url: '/desk/user',
          label: 'User',
      },
      groups: {
        url: '/desk/user/group',
        label: 'Group',
      }
    }
  },
  setting: {
    url: '#',
    label: 'Setting',
    children: {
      general: {
        url: '/desk/setting/general',
        label: 'General'
      },
      menu: {
        url: '/desk/setting/menu',
        label: 'Menus'
      },
    }
  },
  system: {
    url: '#',
    label: 'System',
    children: {
      log: {
        url: '/desk/system/log',
        label: 'Log'
      }
    }
  },

}
