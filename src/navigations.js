// @todo move this per module
module.exports = {
  dashboard: {
    url: '/desk',
    label: 'Dashboard',
  },
  blog: {
    url: "#",
    label: "Blog",
    children: {
      post: {
        url: '/desk/blog/post',
        label: 'Posts'
      },
      category: {
        url: '/desk/blog/category',
        label: 'Category'
      },
      comments: {
        url: '/desk/blog/comments',
        label: 'Comments'
      },
    }
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
      themes: {
        url: '/desk/setting/themes',
        label: 'Themes'
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
