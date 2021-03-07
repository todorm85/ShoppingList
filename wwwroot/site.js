import './components/nav-component.js'

var titleEl = document.getElementsByTagName('title')[0];
titleEl.innerHTML = 'Shopping list';

var nav = document.createElement("nav-component");
document.body.prepend(nav);


// for qucik preview of watch
if (false) {
    const watchSim = document.createElement('script');
    watchSim.setAttribute('src', 'watch-sim.js');
    document.head.append(watchSim);
}

// to avoid flickering
window.onload = function () {
    document.body.className += 'all-loaded';
}