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
      tags: {
        url: '/desk/blog/tag',
        label: 'Tags'
      },
    }
  },
  page: {
    url: '/desk/page',
    label: 'Pages',
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
  system: {
    url: '#',
    label: 'System',
    children: {
      log: {
        url: '/desk/system/log',
        label: 'Log'
      }
    }
  }
}
