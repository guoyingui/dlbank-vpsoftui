(function () {
    //至少16位
    var asekey = "VpAEF@@BbD36G7LP";
    var rid = vpUtils.Url.getUrlParam(window.location.href,'rid');
    var docId,authcode;
    if (vpCommons.isNotEmpty(rid)) {
        vp.cookie.getAndSetToken(); //注入
        var resource = JSON.parse(vp.encrypt.aesDecrypt(rid, asekey));
        docId = resource.docId;
        authcode = resource.authcode;
    } else {
        docId = vpUtils.Url.getUrlParam(window.location.href, 'docId');
        authcode = vpUtils.Url.getUrlParam(window.location.href, 'authcode');
    }

    vpUtils.resource = vpUtils.resource || {};
    vpUtils.resource = {
        docId : docId,
        authcode : authcode
    }
})();


