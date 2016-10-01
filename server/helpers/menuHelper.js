const submenu = (user) => {
    var menu = [, {
        title: 'Фотографии',
        link: '/gallery'
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
    }];

    if(user) {
        return menu.concat(
            [{
                title: 'Профиль',
                link: '/profile'
            }]);
    }

    return menu;
};

var addAuth = (menu, user) => {
    if(!user) {
        return menu.concat(
            [{
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
    }];
};

const commonActions = () => {
    return [{
        text: 'Туры',
        href: '/tours',
        icon: 'globe'
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