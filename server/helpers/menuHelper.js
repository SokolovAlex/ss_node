var submenu = () => {
    return [{
        title: 'Профиль',
        link: '/profile'
    }, {
        title: 'Фотографии',
        link: '/gallery'
    }, {
        title: 'результаты игр',
        link: '/game_results'
    }, {
        separator: true
    }, {
        title: 'Выйти',
        link: '/auth/logout'
    }];
};

var addAuth = (menu, user) => {
    if(!user) {
        return menu.concat([{
            title: 'Войти',
            modal: true,
            link: '#loginModal'
        }]);
    }
    return menu.concat([{
        title: `${user.fname} ${user.lname}`,
        icon: 'user',
        submenu: submenu()
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
    }, {
        title: 'Прочее',
        submenu: submenu()
    }];

    menu = addAuth(menu, user);

    return menu;
};

const back = (user, current) => {
    var menu = [{
        title: 'Назад',
        link: '/'
    }, {
        title: 'Прочее',
        submenu: submenu()
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
    }];
};

const commonActions = () => {
    return [{
        text: 'Туры',
        href: '/tours',
        icon: 'globe'
    }, {
        title: 'Галерея',
        link: '/gallery'
    }, {
        text: 'Авиабилеты',
        href: '/aviakassa',
        icon: 'plane'
    },{
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