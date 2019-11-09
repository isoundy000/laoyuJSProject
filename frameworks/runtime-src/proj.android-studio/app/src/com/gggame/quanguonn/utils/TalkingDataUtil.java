package com.gggame.quanguonn.utils;

import com.tendcloud.tenddata.TDGAAccount;
import com.tendcloud.tenddata.TDGAVirtualCurrency;

/**
 * talkingdata工具
 * Created by zhangluxin on 2017/11/1.
 */
public class TalkingDataUtil {

    /**
     * 注册
     *
     * @param uid   appid
     * @param name 渠道
     */
    public static void setAccount(String uid ,String name) {
        TDGAAccount account = TDGAAccount.setAccount(uid);
        account.setAccountName(name);
    }

    /**
     * 支付请求
     *
     * @param orderId               orderId
     * @param iapId                 iapId
     * @param currencyAmount        currencyAmount
     * @param currencyType          currencyType
     * @param virtualCurrencyAmount virtualCurrencyAmount
     * @param paymentType           paymentType
     */
    public static void onChargeRequest(String orderId, String iapId, String currencyAmount, String currencyType, String virtualCurrencyAmount, String paymentType) {
        TDGAVirtualCurrency.onChargeRequest(orderId, iapId, Double.valueOf(currencyAmount), currencyType, Double.valueOf(virtualCurrencyAmount), paymentType);
    }

    /**
     * 支付成功请求
     *
     * @param orderId orderId
     */
    public static void onChargeSuccess(String orderId) {
        TDGAVirtualCurrency.onChargeSuccess(orderId);
    }
}
