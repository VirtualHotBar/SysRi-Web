if (location.host !== "sysri.cn") {
    const { pathname, search, hash } = location;
    location.replace(`https://sysri.cn${pathname}${search}${hash}`);
};

(function() {
    var script = document.createElement('script');
    script.src = 'https://mxana.tacool.com/sdk.js';
    script.id = 'MXA_COLLECT';
    script.async = true;
    script.onload = function() {
        if (window.MXA && window.MXA.init) {
            window.MXA.init({ id: "c1-DcvmmKgc" });
        }
    };
    document.head.appendChild(script);
})();


    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="//www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "ne64v69ll5");
