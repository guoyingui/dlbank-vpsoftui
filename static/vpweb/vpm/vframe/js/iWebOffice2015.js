var str = '';
var copyright = "金格科技iWebOffice2015智能文档中间件[演示版];V5.0S0xGAAEAAAAAAAAAEAAAAHYBAACAAQAALAAAAMhgYPyhG1JeK32w+MoaJsdQXm18HWUbGpjMu4KXjsDecIGSwVMaepwqsjDH53vbZvAjCfYEjWLCInoMmbAfZhyeikyNJa0go8ItDHo9Wp9O791h7K68woxEV7CrX0HQkrE2Vw32FeR/evBr2XJHlOlsrV1UI/SUbN2VTMclIJrh0qlmvNT4NRrSfXsFM7s2eADGjNRraH03Kf2/T8lyE9Xw3kttPJbcSgkyqSqSzJJdFS5bxIWLkdR7HleoNtXAfSplHtE7qjAgNnyfJw04j1f6jQHW6e75jsKujDrBIJk8R5zTB6pFv2ekPouTiV4LhgvdH7MjRcwzwP93W8zRTUyt/z3/pEYxx+YYPaGN/IVl6zYBEyXIl9yr+Fn48wPaEDLrbJuQTIcQbV0ZnUqPg2Q7FDS9gzX+y7wLHQtsgi2cDuf4SQne9E6IQ0KW29Z0UqCBMAN+L+z0qT0NEGgfLB897ZnvbePB4gkM0A+CrJaWbTM2W/lyQYRh3NjoZBGNvrL/OR3c8ksq/sua1/w2UEA=";
str += '<object id="WebOffice2015" ';

str += ' width="100%"';
str += ' height="100%"';

if ((window.ActiveXObject!=undefined) || (window.ActiveXObject!=null) ||"ActiveXObject" in window)
{
	str += ' CLASSID="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"  codebase="iWebOffice2015.cab#version=12,2,0,382"';
	str += '>';
	str += '<param name="Copyright" value="' + copyright + '">';
}
else
{
	str += ' progid="Kinggrid.iWebOffice"';
	str += ' type="application/iwebplugin"';
	str += ' OnCommand="OnCommand"';
	str += ' OnReady="OnReady"';
	str += ' OnOLECommand="OnOLECommand"';
	str += ' OnExecuteScripted="OnExecuteScripted"';
	str += ' OnQuit="OnQuit"';
	str += ' OnSendStart="OnSendStart"';
	str += ' OnSending="OnSending"';
	str += ' OnSendEnd="OnSendEnd"';
	str += ' OnRecvStart="OnRecvStart"';
	str += ' OnRecving="OnRecving"';
	str += ' OnRecvEnd="OnRecvEnd"';
	str += ' OnRightClickedWhenAnnotate="OnRightClickedWhenAnnotate"';
	str += ' OnFullSizeBefore="OnFullSizeBefore"';
	str += ' OnFullSizeAfter="OnFullSizeAfter"';	
	str += ' Copyright="' + copyright + '"';
	str += '>';
}
str += '</object>';
document.write(str); 