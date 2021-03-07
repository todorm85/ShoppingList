let header = document.createElement("div");
header.className = 'watch-simulator';

const linkElem = document.createElement('style');
linkElem.innerText = `.watch-simulator {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: -moz-radial-gradient(transparent 150px, rgba(0,0,0,1) 150px);
    background: -webkit-radial-gradient(transparent 180px, rgba(0,0,0,1) 180px);
    pointer-events: none;
    z-index: 200;
}
`;

document.body.append(linkElem, header);
