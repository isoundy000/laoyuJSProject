package com.gggame.quanguonn.sgapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import com.gggame.quanguonn.utils.XianLiaoUtil;
import org.xianliao.im.sdk.api.ISGAPI;
import org.xianliao.im.sdk.api.ISGAPIEventHandler;
import org.xianliao.im.sdk.constants.SGConstants;
import org.xianliao.im.sdk.modelbase.BaseReq;
import org.xianliao.im.sdk.modelbase.BaseResp;
import org.xianliao.im.sdk.modelmsg.SendAuth;

public class SGEntryActivity extends Activity implements ISGAPIEventHandler {

    ISGAPI api;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        api = XianLiaoUtil.getInstance().getmApi();
        api.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        api.handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq req) {

        if (req != null) {

        }

    }

    @Override
    public void onResp(BaseResp resp) {
        switch (resp.errCode) {
            case SGConstants.ERR_OK:
                if (resp.getType() == SGConstants.COMMAND_AUTH) {
                    SendAuth.Resp respAuth = (SendAuth.Resp) resp;
                    XianLiaoUtil.setXianLiaoLoginState(resp.errCode + "");
                    XianLiaoUtil.setXianLiaoLoginCode(respAuth.code);
                    // Toast.makeText(this, "授权登录成功！"+resp.errCode + "\ncode: "+respAuth.code, Toast.LENGTH_SHORT).show();
                } else if (resp.getType() == SGConstants.COMMAND_SHARE) {
                    // Toast.makeText(this, "分享成功！"+resp.errCode, Toast.LENGTH_SHORT).show();
                }
                break;

            case SGConstants.ERR_CANCEL:
                if (resp.getType() == SGConstants.COMMAND_AUTH) {
                    // Toast.makeText(this, "授权登录取消！"+resp.errCode, Toast.LENGTH_SHORT).show();
//                    EventBus.getDefault().post(new AuthCodeEvent(AuthCodeEnum.AUTH_SUCESS,"0"));
                } else if (resp.getType() == SGConstants.COMMAND_SHARE) {
                    // Toast.makeText(this, "分享取消！"+resp.errCode, Toast.LENGTH_SHORT).show();
                }
                break;
            case SGConstants.ERR_FAIL:
                if (resp.getType() == SGConstants.COMMAND_AUTH) {
                    // Toast.makeText(this, "授权登录失败！"+resp.errCode, Toast.LENGTH_SHORT).show();
//                    EventBus.getDefault().post(new AuthCodeEvent(AuthCodeEnum.AUTH_FAIL,"0"));
                } else if (resp.getType() == SGConstants.COMMAND_SHARE) {
                    // Toast.makeText(this, "分享失败！"+resp.errCode, Toast.LENGTH_SHORT).show();
                }
                break;
        }
        finish();
    }

    @Override
    protected void onResume() {
        super.onResume();
    }
}
