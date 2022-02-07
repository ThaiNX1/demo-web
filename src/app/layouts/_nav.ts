export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
  },
  {
    name: 'Người dùng',
    url: '',
    icon: 'icon-people',
  },
  {
    name: 'Cài đặt',
    url: '',
    icon: 'icon-settings',
    children: [
      {
        name: 'Nhóm quyền',
        url: '/',
        icon: '',
      },
      {
        name: 'Phân quyền',
        url: '/',
        icon: '',
      },
    ],
  },
];
export interface INavData {
  name?: string;
  url?: string;
  icon?: string;
  children?: INavData[];
}
