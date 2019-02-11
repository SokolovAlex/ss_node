const submenu = (user) => {
  var menu = user ? [{
    title: 'Профиль',
    link: '/profile'
  }] : [];

  return menu.concat([{
    title: 'Фотографии',
    link: '/gallery'
  }, {
    title: 'Наши достижения',
    link: '/awards-gallery'
  }, {
    title: 'Игры',
    link: '/games'
  }, {
    title: 'Наши партнеры',
    link: '/partners'
  }, {
    separator: true
  }, {
    title: 'Выйти',
    link: '/auth/logout'
  }]);
};

var addAuth = (menu, user) => {
  if (!user) {
    return menu.concat([{
      title: 'Прочее',
      submenu: submenu(user)
    }, {
      title: 'Войти',
      modal: true,
      link: '#loginModal'
    }]);
  }
  return menu.concat([{
    title: `${user.fname} ${user.lname}`,
    icon: 'user',
    submenu: submenu(user)
  }]);
};

const welcome = (user) => {
  var menu = [{
    title: 'Туры',
    link: '#hot',
    scroll: true
  }, {
    title: 'О нас',
    link: '#about',
    scroll: true
  }, {
    title: 'Команда',
    link: '#team',
    scroll: true
  }, {
    title: 'Заявка',
    link: '#contact',
    scroll: true
  }];

  menu = addAuth(menu, user);

  return menu;
};

const back = (user, current) => {
  var menu = [{
    title: 'Назад',
    link: '/'
  }];
  menu = addAuth(menu, user);
  return menu;
};

const profileActions = () => {
  return [{
    text: 'Туры',
    href: '/tours',
    icon: 'globe'
  }, {
    text: 'Фотографии',
    href: '/photos',
    icon: 'photo'
  }, {
    text: 'Достижения',
    href: '/awards',
    icon: 'graduation-cap'
  }];
};

const commonActions = () => {
  return [{
    text: 'Статьи',
    href: '/articles',
    icon: 'globe'
  }, {
    text: 'Авиабилеты',
    href: '/aviakassa',
    icon: 'plane'
  }, {
    text: 'Круизы',
    href: '/cruises',
    icon: 'ship'
  }];
};

module.exports = {
  welcome,
  back,
  profileActions,
  commonActions
};