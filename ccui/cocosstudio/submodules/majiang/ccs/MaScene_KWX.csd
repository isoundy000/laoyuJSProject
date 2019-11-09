<GameFile>
  <PropertyGroup Name="MaScene_KWX" Type="Scene" ID="a2ee0952-26b5-49ae-8bf9-4f1d6279b798" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" ActivedAnimationName="guafeng" />
      <AnimationList>
        <AnimationInfo Name="guafeng" StartIndex="0" EndIndex="18">
          <RenderColor A="255" R="128" G="128" B="128" />
        </AnimationInfo>
        <AnimationInfo Name="xiayu" StartIndex="0" EndIndex="18">
          <RenderColor A="255" R="119" G="136" B="153" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Scene" ctype="GameNodeObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="bgPanel" ActionTag="-1139807906" Tag="770" IconVisible="False" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" ClipAble="False" BackColorAlpha="191" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="1.0000" />
            <SingleColor A="255" R="0" G="0" B="0" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="bg" ActionTag="1541780280" Tag="374" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="617.0000" RightMargin="617.0000" TopMargin="339.6640" BottomMargin="334.3360" ctype="SpriteObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="357.3360" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.4963" />
            <PreSize X="0.0359" Y="0.0639" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene/table_back0.jpg" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="Image_2" ActionTag="393143686" Tag="89" IconVisible="False" LeftMargin="-7.6108" RightMargin="-7.3892" TopMargin="-1.8400" BottomMargin="682.8400" Scale9Enable="True" LeftEage="25" RightEage="25" TopEage="8" BottomEage="8" Scale9OriginX="25" Scale9OriginY="8" Scale9Width="27" Scale9Height="11" ctype="ImageViewObjectData">
            <Size X="1295.0000" Y="39.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="639.8892" Y="702.3400" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.4999" Y="0.9755" />
            <PreSize X="1.0117" Y="0.0542" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/table_player_bg.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="lb_wanfa" ActionTag="-1802017252" Tag="444" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="2.9440" RightMargin="33.0560" TopMargin="4.7800" BottomMargin="687.2200" FontSize="24" LabelText="_________________________________________________湖南麻将_____________________________________" VerticalAlignmentType="VT_Center" ShadowOffsetX="1.0000" ShadowOffsetY="-1.0000" ctype="TextObjectData">
            <Size X="1244.0000" Y="28.0000" />
            <AnchorPoint ScaleY="0.5000" />
            <Position X="2.9440" Y="701.2200" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="141" G="148" B="152" />
            <PrePosition X="0.0023" Y="0.9739" />
            <PreSize X="0.9719" Y="0.0389" />
            <OutlineColor A="255" R="61" G="55" B="55" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="logo" ActionTag="-653945027" Tag="1469" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="522.5000" RightMargin="522.5000" TopMargin="222.4300" BottomMargin="438.5700" ctype="SpriteObjectData">
            <Size X="235.0000" Y="59.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="468.0700" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.6501" />
            <PreSize X="0.1836" Y="0.0819" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/table_back_logo.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="lb_roomid" ActionTag="-862131523" Tag="445" IconVisible="False" LeftMargin="91.0013" RightMargin="1102.9987" TopMargin="43.3015" BottomMargin="650.6985" FontSize="22" LabelText="8888888" OutlineEnabled="True" ShadowOffsetX="1.0000" ShadowOffsetY="-1.0000" ctype="TextObjectData">
            <Size X="86.0000" Y="26.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="134.0013" Y="663.6985" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.1047" Y="0.9218" />
            <PreSize X="0.0672" Y="0.0361" />
            <OutlineColor A="255" R="61" G="55" B="55" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="lb_roomid_" ActionTag="1987785291" Tag="446" IconVisible="False" LeftMargin="1.4087" RightMargin="1190.5913" TopMargin="37.4883" BottomMargin="656.5117" FontSize="22" LabelText="房间号：" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="1.0000" ShadowOffsetY="-1.0000" ctype="TextObjectData">
            <Size X="88.0000" Y="26.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="45.4087" Y="669.5117" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="239" G="213" B="160" />
            <PrePosition X="0.0355" Y="0.9299" />
            <PreSize X="0.0688" Y="0.0361" />
            <OutlineColor A="255" R="61" G="55" B="55" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="lb_recordid_" ActionTag="1614240445" VisibleForFrame="False" Tag="636" IconVisible="False" LeftMargin="1.4703" RightMargin="1190.5297" TopMargin="64.6853" BottomMargin="629.3147" FontSize="22" LabelText="回放码：" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="1.0000" ShadowOffsetY="-1.0000" ctype="TextObjectData">
            <Size X="88.0000" Y="26.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="45.4703" Y="642.3147" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="239" G="213" B="160" />
            <PrePosition X="0.0355" Y="0.8921" />
            <PreSize X="0.0688" Y="0.0361" />
            <OutlineColor A="255" R="61" G="55" B="55" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="lb_recordid" ActionTag="592111811" VisibleForFrame="False" Tag="635" IconVisible="False" LeftMargin="90.5630" RightMargin="1078.4370" TopMargin="70.4985" BottomMargin="623.5015" FontSize="22" LabelText="140675684" OutlineEnabled="True" ShadowOffsetX="1.0000" ShadowOffsetY="-1.0000" ctype="TextObjectData">
            <Size X="111.0000" Y="26.0000" />
            <AnchorPoint ScaleY="0.5000" />
            <Position X="90.5630" Y="636.5015" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.0708" Y="0.8840" />
            <PreSize X="0.0867" Y="0.0361" />
            <OutlineColor A="255" R="61" G="55" B="55" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="lb_time" ActionTag="178959651" Tag="447" IconVisible="False" LeftMargin="1180.4008" RightMargin="43.5992" TopMargin="11.4600" BottomMargin="682.5400" FontSize="22" LabelText="13:04" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="1.0000" ShadowOffsetY="-1.0000" ctype="TextObjectData">
            <Size X="56.0000" Y="26.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1208.4008" Y="695.5400" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="202" G="202" B="202" />
            <PrePosition X="0.9441" Y="0.9660" />
            <PreSize X="0.0437" Y="0.0361" />
            <OutlineColor A="255" R="61" G="55" B="55" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_zhunbei" ActionTag="-883854926" VisibleForFrame="False" Tag="287" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="546.0000" RightMargin="546.0000" TopMargin="325.5000" BottomMargin="325.5000" ctype="SpriteObjectData">
            <Size X="188.0000" Y="69.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="0.1469" Y="0.0958" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_zb.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_huanzhuo" ActionTag="566338650" VisibleForFrame="False" Tag="252" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="546.5120" RightMargin="545.4880" TopMargin="253.7880" BottomMargin="397.2120" ctype="SpriteObjectData">
            <Size X="188.0000" Y="69.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.5120" Y="431.7120" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5004" Y="0.5996" />
            <PreSize X="0.1469" Y="0.0958" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/huanzhuo.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_invite" ActionTag="692639874" Tag="347" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="505.0000" RightMargin="505.0000" TopMargin="306.0160" BottomMargin="337.9840" ctype="SpriteObjectData">
            <Size X="270.0000" Y="76.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="375.9840" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5222" />
            <PreSize X="0.2109" Y="0.1056" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_yaoqinghaoyou.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_qq" ActionTag="1242766047" VisibleForFrame="False" Tag="145" IconVisible="False" LeftMargin="502.2502" RightMargin="696.7498" TopMargin="400.5000" BottomMargin="218.5000" ctype="SpriteObjectData">
            <Size X="81.0000" Y="101.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="542.7502" Y="269.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.4240" Y="0.3736" />
            <PreSize X="0.0633" Y="0.1403" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_qq.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_liaobei" ActionTag="428413963" VisibleForFrame="False" Tag="183" IconVisible="False" LeftMargin="802.5000" RightMargin="396.5000" TopMargin="400.5000" BottomMargin="218.5000" ctype="SpriteObjectData">
            <Size X="81.0000" Y="101.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="843.0000" Y="269.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.6586" Y="0.3736" />
            <PreSize X="0.0633" Y="0.1403" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/liaobeifenxiang.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_copy" ActionTag="-1192508265" Tag="144" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="505.0000" RightMargin="505.0000" TopMargin="377.6560" BottomMargin="266.3440" ctype="SpriteObjectData">
            <Size X="270.0000" Y="76.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="304.3440" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.4227" />
            <PreSize X="0.2109" Y="0.1056" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_fuzhi.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_fanhui" ActionTag="-628638838" VisibleForFrame="False" Tag="516" IconVisible="False" LeftMargin="1029.0000" RightMargin="27.0000" TopMargin="617.0000" BottomMargin="27.0000" ctype="SpriteObjectData">
            <Size X="224.0000" Y="76.0000" />
            <Children>
              <AbstractNodeData Name="Text_22_0" ActionTag="1979238325" Tag="517" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="33.6448" RightMargin="30.3552" TopMargin="15.9490" BottomMargin="15.0510" FontSize="40" LabelText="退出房间" OutlineSize="0" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="160.0000" Y="45.0000" />
                <AnchorPoint ScaleX="0.4963" ScaleY="0.4762" />
                <Position X="113.0528" Y="36.4800" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5047" Y="0.4800" />
                <PreSize X="0.7143" Y="0.5921" />
                <OutlineColor A="255" R="255" G="255" B="255" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1141.0000" Y="65.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8914" Y="0.0903" />
            <PreSize X="0.1750" Y="0.1056" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_bg_orange.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_leave" ActionTag="-999132544" VisibleForFrame="False" Tag="255" IconVisible="False" LeftMargin="1029.0000" RightMargin="27.0000" TopMargin="551.0003" BottomMargin="92.9997" ctype="SpriteObjectData">
            <Size X="224.0000" Y="76.0000" />
            <Children>
              <AbstractNodeData Name="Text_22_0" ActionTag="1749885" Tag="256" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="33.6448" RightMargin="30.3552" TopMargin="15.9490" BottomMargin="15.0510" FontSize="40" LabelText="退出房间" OutlineSize="0" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="160.0000" Y="45.0000" />
                <AnchorPoint ScaleX="0.4963" ScaleY="0.4762" />
                <Position X="113.0528" Y="36.4800" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5047" Y="0.4800" />
                <PreSize X="0.7143" Y="0.5921" />
                <OutlineColor A="255" R="255" G="255" B="255" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1141.0000" Y="130.9997" />
            <Scale ScaleX="0.8000" ScaleY="0.8000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8914" Y="0.1819" />
            <PreSize X="0.1750" Y="0.1056" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_bg_orange.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_jiesan" ActionTag="-557093621" VisibleForFrame="False" Tag="151" IconVisible="False" LeftMargin="1049.3745" RightMargin="43.6255" TopMargin="620.1366" BottomMargin="29.8634" ctype="SpriteObjectData">
            <Size X="187.0000" Y="70.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1142.8745" Y="64.8634" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8929" Y="0.0901" />
            <PreSize X="0.1461" Y="0.0972" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_jsfz.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_yxks" ActionTag="-233623913" VisibleForFrame="False" Tag="79" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="536.0000" RightMargin="536.0000" TopMargin="331.4600" BottomMargin="319.5400" ctype="SpriteObjectData">
            <Size X="208.0000" Y="69.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="354.0400" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.4917" />
            <PreSize X="0.1625" Y="0.0958" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_yxks.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_bg" ActionTag="-1803157861" VisibleForFrame="False" Tag="181" IconVisible="False" LeftMargin="1175.4343" RightMargin="18.5657" TopMargin="109.9169" BottomMargin="332.0831" ctype="SpriteObjectData">
            <Size X="86.0000" Y="278.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1218.4343" Y="471.0831" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9519" Y="0.6543" />
            <PreSize X="0.0672" Y="0.3861" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_bg.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="setting" ActionTag="1179892923" VisibleForFrame="False" Tag="148" IconVisible="False" LeftMargin="1183.4983" RightMargin="32.5017" TopMargin="136.3687" BottomMargin="519.6313" ctype="SpriteObjectData">
            <Size X="64.0000" Y="64.0000" />
            <AnchorPoint ScaleX="0.5317" ScaleY="0.4488" />
            <Position X="1217.5271" Y="548.3545" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9512" Y="0.7616" />
            <PreSize X="0.0500" Y="0.0889" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/setting2.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="chat" ActionTag="672968539" VisibleForFrame="False" Tag="149" IconVisible="False" LeftMargin="1183.5015" RightMargin="32.4985" TopMargin="223.9932" BottomMargin="436.0068" ctype="SpriteObjectData">
            <Size X="64.0000" Y="60.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1215.5015" Y="466.0068" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9496" Y="0.6472" />
            <PreSize X="0.0500" Y="0.0833" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/chat2.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_mic" ActionTag="-54757833" Tag="166" IconVisible="False" LeftMargin="1176.9067" RightMargin="17.0933" TopMargin="403.6426" BottomMargin="230.3574" ctype="SpriteObjectData">
            <Size X="86.0000" Y="86.0000" />
            <AnchorPoint ScaleX="0.4773" ScaleY="0.5277" />
            <Position X="1217.9546" Y="275.7396" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9515" Y="0.3830" />
            <PreSize X="0.0672" Y="0.1194" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/sp_mic2.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_control_btns" ActionTag="1602398579" Tag="179" IconVisible="False" LeftMargin="1170.2311" RightMargin="17.7689" TopMargin="58.1683" BottomMargin="593.8317" ctype="SpriteObjectData">
            <Size X="92.0000" Y="68.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1216.2311" Y="627.8317" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9502" Y="0.8720" />
            <PreSize X="0.0719" Y="0.0944" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_btnlist.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="jiesan" ActionTag="-1285300581" VisibleForFrame="False" Tag="180" IconVisible="False" LeftMargin="1184.5015" RightMargin="33.4985" TopMargin="307.6203" BottomMargin="354.3797" ctype="SpriteObjectData">
            <Size X="62.0000" Y="58.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1215.5015" Y="383.3797" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9496" Y="0.5325" />
            <PreSize X="0.0484" Y="0.0806" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_jiesanfangjian.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="signal" ActionTag="1613569959" Tag="154" IconVisible="False" LeftMargin="1142.6353" RightMargin="106.3647" TopMargin="6.2869" BottomMargin="688.7131" ctype="SpriteObjectData">
            <Size X="31.0000" Y="25.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1158.1353" Y="701.2131" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9048" Y="0.9739" />
            <PreSize X="0.0242" Y="0.0347" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/signal1_3.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="battery" ActionTag="298563863" Tag="695" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="1244.1960" RightMargin="0.8040" TopMargin="12.5960" BottomMargin="690.4040" ctype="SpriteObjectData">
            <Size X="35.0000" Y="17.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1261.6960" Y="698.9040" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9857" Y="0.9707" />
            <PreSize X="0.0273" Y="0.0236" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/battery5.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="speaker" ActionTag="1494224065" VisibleForFrame="False" Tag="55" IconVisible="False" TopMargin="-1.3190" BottomMargin="711.3190" TouchEnable="True" ClipAble="False" BackColorAlpha="0" ComboBoxIndex="1" ColorAngle="90.0000" LeftEage="222" RightEage="222" TopEage="15" BottomEage="15" Scale9OriginX="-222" Scale9OriginY="-15" Scale9Width="444" Scale9Height="30" ctype="PanelObjectData">
            <Size X="1280.0000" Y="10.0000" />
            <Children>
              <AbstractNodeData Name="icon_lb_3" CanEdit="False" ActionTag="1347196633" Tag="60" IconVisible="False" LeftMargin="315.1613" RightMargin="928.8387" TopMargin="10.9905" BottomMargin="-30.9905" ctype="SpriteObjectData">
                <Size X="36.0000" Y="30.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="333.1613" Y="-15.9905" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2603" Y="-1.5991" />
                <PreSize X="0.0281" Y="3.0000" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/icon_lb.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Image_1" CanEdit="False" ActionTag="-1976776190" Tag="58" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="307.6097" RightMargin="307.6097" TopMargin="1.5000" BottomMargin="-32.5000" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="13" BottomEage="13" Scale9OriginX="15" Scale9OriginY="13" Scale9Width="162" Scale9Height="15" ctype="ImageViewObjectData">
                <Size X="664.7806" Y="41.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="-12.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-1.2000" />
                <PreSize X="0.5194" Y="4.1000" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/bg_gg.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="panel" CanEdit="False" ActionTag="-1150306917" Tag="56" IconVisible="False" LeftMargin="352.2996" RightMargin="338.3333" TopMargin="4.7174" BottomMargin="-29.7174" TouchEnable="True" ClipAble="True" BackColorAlpha="0" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                <Size X="589.3672" Y="35.0000" />
                <AnchorPoint />
                <Position X="352.2996" Y="-29.7174" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2752" Y="-2.9717" />
                <PreSize X="0.4604" Y="3.5000" />
                <SingleColor A="255" R="255" G="255" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position Y="711.3190" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition Y="0.9879" />
            <PreSize X="1.0000" Y="0.0139" />
            <SingleColor A="255" R="255" G="255" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="piao_bar" CanEdit="False" ActionTag="-1231260419" VisibleForFrame="False" Tag="90" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="413.0000" RightMargin="413.0000" TopMargin="310.9601" BottomMargin="338.0399" ctype="SpriteObjectData">
            <Size X="454.0000" Y="71.0000" />
            <Children>
              <AbstractNodeData Name="Image_3" CanEdit="False" ActionTag="-2144442359" Tag="820" IconVisible="False" LeftMargin="-413.0876" RightMargin="-412.9124" TopMargin="97.5791" BottomMargin="-226.5791" Scale9Enable="True" LeftEage="149" RightEage="149" TopEage="23" BottomEage="23" Scale9OriginX="149" Scale9OriginY="23" Scale9Width="156" Scale9Height="25" ctype="ImageViewObjectData">
                <Size X="1280.0000" Y="200.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="226.9124" Y="-126.5791" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4998" Y="-1.7828" />
                <PreSize X="2.8194" Y="2.8169" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/showword_black_bg.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_21" ActionTag="1209781188" Tag="814" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="152.0000" RightMargin="152.0000" TopMargin="18.0000" BottomMargin="19.0000" FontSize="30" LabelText="请选择加漂" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="150.0000" Y="34.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="227.0000" Y="36.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.5070" />
                <PreSize X="0.3304" Y="0.4789" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="piao0" ActionTag="-1099035506" Tag="91" IconVisible="False" LeftMargin="-123.3124" RightMargin="419.3124" TopMargin="162.5656" BottomMargin="-167.5656" ctype="SpriteObjectData">
                <Size X="158.0000" Y="76.0000" />
                <Children>
                  <AbstractNodeData Name="Text_22" ActionTag="235517632" Tag="815" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="27.5000" RightMargin="27.5000" TopMargin="15.5000" BottomMargin="15.5000" FontSize="40" LabelText="不  漂" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="103.0000" Y="45.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="79.0000" Y="38.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.6519" Y="0.5921" />
                    <OutlineColor A="255" R="255" G="255" B="255" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-44.3124" Y="-129.5656" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="-0.0976" Y="-1.8249" />
                <PreSize X="0.3480" Y="1.0704" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_bg_orange_small.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="piao1" ActionTag="12161257" Tag="816" IconVisible="False" LeftMargin="150.6455" RightMargin="145.3545" TopMargin="162.5656" BottomMargin="-167.5656" ctype="SpriteObjectData">
                <Size X="158.0000" Y="76.0000" />
                <Children>
                  <AbstractNodeData Name="Text_22" ActionTag="-1335132950" Tag="817" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="19.0000" RightMargin="19.0000" TopMargin="15.5000" BottomMargin="15.5000" FontSize="40" LabelText="加一漂" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="120.0000" Y="45.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="79.0000" Y="38.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.7595" Y="0.5921" />
                    <OutlineColor A="255" R="255" G="255" B="255" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="229.6455" Y="-129.5656" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5058" Y="-1.8249" />
                <PreSize X="0.3480" Y="1.0704" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_bg_green_small.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="piao2" ActionTag="-1396980775" Tag="818" IconVisible="False" LeftMargin="424.6045" RightMargin="-128.6045" TopMargin="162.5656" BottomMargin="-167.5656" ctype="SpriteObjectData">
                <Size X="158.0000" Y="76.0000" />
                <Children>
                  <AbstractNodeData Name="Text_22" ActionTag="-251855440" Tag="819" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="19.0000" RightMargin="19.0000" TopMargin="15.5000" BottomMargin="15.5000" FontSize="40" LabelText="加二漂" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="120.0000" Y="45.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="79.0000" Y="38.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.7595" Y="0.5921" />
                    <OutlineColor A="255" R="255" G="255" B="255" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="503.6045" Y="-129.5656" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="1.1093" Y="-1.8249" />
                <PreSize X="0.3480" Y="1.0704" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_bg_green_small.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="373.5399" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5188" />
            <PreSize X="0.3547" Y="0.0986" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/showword_black_bg.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="fangzhuheader" ActionTag="-129679476" VisibleForFrame="False" Tag="445" IconVisible="False" LeftMargin="969.5000" RightMargin="215.5000" TopMargin="42.0000" BottomMargin="526.0000" ctype="SpriteObjectData">
            <Size X="95.0000" Y="152.0000" />
            <Children>
              <AbstractNodeData Name="header" ActionTag="1592497031" Tag="446" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="15.5000" RightMargin="15.5000" TopMargin="15.5000" BottomMargin="72.5000" ctype="SpriteObjectData">
                <Size X="64.0000" Y="64.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="47.5000" Y="104.5000" />
                <Scale ScaleX="0.8000" ScaleY="0.8000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.6875" />
                <PreSize X="0.6737" Y="0.4211" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/transparent_64x64.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="name" ActionTag="-1663283734" Tag="447" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-27.5000" RightMargin="-27.5000" TopMargin="80.9836" BottomMargin="42.0164" FontSize="25" LabelText="名字预留六字" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="150.0000" Y="29.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="47.5000" Y="56.5164" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.3718" />
                <PreSize X="1.5789" Y="0.1908" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1017.0000" Y="602.0000" />
            <Scale ScaleX="0.8000" ScaleY="0.8000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.7945" Y="0.8361" />
            <PreSize X="0.0742" Y="0.2111" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/people_bg0.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="clubowner" ActionTag="429558243" VisibleForFrame="False" Tag="199" IconVisible="False" LeftMargin="969.5000" RightMargin="215.5000" TopMargin="42.0000" BottomMargin="526.0000" ctype="SpriteObjectData">
            <Size X="95.0000" Y="152.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1017.0000" Y="602.0000" />
            <Scale ScaleX="0.8000" ScaleY="0.8000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.7945" Y="0.8361" />
            <PreSize X="0.0742" Y="0.2111" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/peopleclub_bg.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="info2" ActionTag="-423390919" Tag="113" IconVisible="False" LeftMargin="18.5100" RightMargin="1164.4900" TopMargin="406.6600" BottomMargin="214.3400" ctype="SpriteObjectData">
            <Size X="97.0000" Y="99.0000" />
            <Children>
              <AbstractNodeData Name="people_bg" ActionTag="-1006540937" Tag="501" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-2.5000" RightMargin="-2.5000" TopMargin="10.0400" BottomMargin="-16.0400" ctype="SpriteObjectData">
                <Size X="102.0000" Y="105.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="36.4600" />
                <Scale ScaleX="0.7000" ScaleY="0.7000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.3683" />
                <PreSize X="1.0515" Y="1.0606" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/people_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Sprite_29" ActionTag="-1454686950" Tag="778" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="10.0000" RightMargin="10.0000" TopMargin="127.4460" BottomMargin="-56.4460" ctype="SpriteObjectData">
                <Size X="77.0000" Y="28.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-42.4460" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.4287" />
                <PreSize X="0.7938" Y="0.2828" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/point_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_nickname" ActionTag="702959425" Tag="114" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-19.0000" RightMargin="-19.0000" TopMargin="100.1000" BottomMargin="-27.1000" FontSize="22" LabelText="_一二三四五_" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="135.0000" Y="26.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-14.1000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.1424" />
                <PreSize X="1.3918" Y="0.2626" />
                <OutlineColor A="255" R="61" G="55" B="55" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_score" ActionTag="509745751" Tag="115" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-1.5000" RightMargin="-1.5000" TopMargin="127.7075" BottomMargin="-55.7075" IsCustomSize="True" FontSize="22" LabelText="88884" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="100.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-42.2075" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.4263" />
                <PreSize X="1.0309" Y="0.2727" />
                <OutlineColor A="255" R="61" G="55" B="55" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="head" ActionTag="-1614144946" Tag="121" IconVisible="False" LeftMargin="14.2500" RightMargin="18.7500" TopMargin="31.7500" BottomMargin="3.2500" ctype="SpriteObjectData">
                <Size X="64.0000" Y="64.0000" />
                <AnchorPoint />
                <Position X="14.2500" Y="3.2500" />
                <Scale ScaleX="1.0600" ScaleY="1.0600" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1469" Y="0.0328" />
                <PreSize X="0.6598" Y="0.6465" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/transparent_64x64.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="change_sroce_node" ActionTag="252354488" Tag="189" IconVisible="True" LeftMargin="623.4352" RightMargin="-526.4352" TopMargin="91.0977" BottomMargin="7.9023" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <AnchorPoint />
                <Position X="623.4352" Y="7.9023" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="6.4272" Y="0.0798" />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="offline" ActionTag="-1726150419" VisibleForFrame="False" Tag="560" IconVisible="False" LeftMargin="-3.0000" RightMargin="-2.0000" TopMargin="11.0000" BottomMargin="-14.0000" ctype="SpriteObjectData">
                <Size X="102.0000" Y="102.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.0000" Y="37.0000" />
                <Scale ScaleX="0.6700" ScaleY="0.6700" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4948" Y="0.3737" />
                <PreSize X="1.0515" Y="1.0303" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/lixian.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="tuo" ActionTag="-1705702171" VisibleForFrame="False" Tag="238" IconVisible="False" LeftMargin="-19.9534" RightMargin="80.9534" TopMargin="63.2337" BottomMargin="-0.2337" ctype="SpriteObjectData">
                <Size X="36.0000" Y="36.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-1.9534" Y="17.7663" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="-0.0201" Y="0.1795" />
                <PreSize X="0.3711" Y="0.3636" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/icon_tuo.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="head_bg_1" ActionTag="-1619499162" VisibleForFrame="False" Tag="163" IconVisible="False" LeftMargin="-1.0256" RightMargin="1.0256" TopMargin="-0.1780" BottomMargin="0.1780" ctype="SpriteObjectData">
                <Size X="97.0000" Y="99.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="47.4744" Y="49.6780" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4894" Y="0.5018" />
                <PreSize X="1.0000" Y="1.0000" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/head_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="ok" ActionTag="-102001101" VisibleForFrame="False" Tag="350" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="30.0000" RightMargin="30.0000" TopMargin="-30.5000" BottomMargin="84.5000" ctype="SpriteObjectData">
                <Size X="37.0000" Y="45.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="107.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="1.0808" />
                <PreSize X="0.3814" Y="0.4545" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/ok.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="qp" ActionTag="1094773120" VisibleForFrame="False" Tag="196" IconVisible="False" LeftMargin="93.6585" RightMargin="-67.6585" TopMargin="-24.0445" BottomMargin="59.0445" ctype="SpriteObjectData">
                <Size X="71.0000" Y="64.0000" />
                <AnchorPoint />
                <Position X="93.6585" Y="59.0445" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9656" Y="0.5964" />
                <PreSize X="0.7320" Y="0.6465" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/ltqp2.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="bq" ActionTag="622555186" VisibleForFrame="False" Tag="340" IconVisible="True" LeftMargin="128.4395" RightMargin="-31.4395" TopMargin="1.6570" BottomMargin="97.3430" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <AnchorPoint />
                <Position X="128.4395" Y="97.3430" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="1.3241" Y="0.9833" />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_piaostate0" ActionTag="-592432670" VisibleForFrame="False" Tag="779" IconVisible="False" LeftMargin="94.4600" RightMargin="-116.4600" TopMargin="67.7006" BottomMargin="-0.7006" ctype="SpriteObjectData">
                <Size X="119.0000" Y="32.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="94.4600" Y="15.2994" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9738" Y="0.1545" />
                <PreSize X="1.2268" Y="0.3232" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_xpz.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_piaostate1" ActionTag="463428706" VisibleForFrame="False" Tag="822" IconVisible="False" LeftMargin="94.4600" RightMargin="-88.4600" TopMargin="67.7000" BottomMargin="-0.7000" ctype="SpriteObjectData">
                <Size X="91.0000" Y="32.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="94.4600" Y="15.3000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9738" Y="0.1545" />
                <PreSize X="0.9381" Y="0.3232" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_yxp.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="zhuang" ActionTag="-1287218406" VisibleForFrame="False" Tag="1081" IconVisible="False" LeftMargin="6.7758" RightMargin="64.2242" TopMargin="71.2587" BottomMargin="0.7413" ctype="SpriteObjectData">
                <Size X="26.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="19.7758" Y="14.2413" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2039" Y="0.1439" />
                <PreSize X="0.2680" Y="0.2727" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/zhuang.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="liang" ActionTag="-1226615018" VisibleForFrame="False" Tag="436" IconVisible="False" LeftMargin="64.5000" RightMargin="-2.5000" TopMargin="14.0000" BottomMargin="43.0000" ctype="SpriteObjectData">
                <Size X="35.0000" Y="42.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="82.0000" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8454" Y="0.6465" />
                <PreSize X="0.3608" Y="0.4242" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/liang2.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_bs" ActionTag="-768242613" VisibleForFrame="False" Tag="810" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="17.5000" RightMargin="17.5000" TopMargin="1.0000" BottomMargin="76.0000" ctype="SpriteObjectData">
                <Size X="62.0000" Y="22.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="87.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8788" />
                <PreSize X="0.6392" Y="0.2222" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_jiapiao.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_bs" ActionTag="-244176252" VisibleForFrame="False" Tag="809" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="35.0000" RightMargin="35.0000" TopMargin="6.5000" BottomMargin="77.5000" LabelText="x892" ctype="TextBMFontObjectData">
                <Size X="27.0000" Y="15.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="85.0000" />
                <Scale ScaleX="0.3700" ScaleY="0.3700" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8586" />
                <PreSize X="0.2784" Y="0.1515" />
              </AbstractNodeData>
              <AbstractNodeData Name="ti" ActionTag="-1231117508" VisibleForFrame="False" Tag="77" IconVisible="False" LeftMargin="9.1026" RightMargin="8.8974" TopMargin="-20.3842" BottomMargin="50.3842" ctype="SpriteObjectData">
                <Size X="79.0000" Y="69.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.6026" Y="84.8842" />
                <Scale ScaleX="0.8000" ScaleY="0.8000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5011" Y="0.8574" />
                <PreSize X="0.8144" Y="0.6970" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_ti.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="67.0100" Y="263.8400" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.0524" Y="0.3664" />
            <PreSize X="0.0758" Y="0.1375" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/transparent_97x99.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="info3" ActionTag="-1537708877" Tag="780" IconVisible="False" LeftMargin="16.5000" RightMargin="1166.5000" TopMargin="188.5000" BottomMargin="432.5000" ctype="SpriteObjectData">
            <Size X="97.0000" Y="99.0000" />
            <Children>
              <AbstractNodeData Name="people_bg" ActionTag="599387372" Tag="781" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-2.5000" RightMargin="-2.5000" TopMargin="10.0400" BottomMargin="-16.0400" ctype="SpriteObjectData">
                <Size X="102.0000" Y="105.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="36.4600" />
                <Scale ScaleX="0.7000" ScaleY="0.7000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.3683" />
                <PreSize X="1.0515" Y="1.0606" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/people_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Sprite_29" ActionTag="2104879288" Tag="782" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="10.0000" RightMargin="10.0000" TopMargin="127.4460" BottomMargin="-56.4460" ctype="SpriteObjectData">
                <Size X="77.0000" Y="28.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-42.4460" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.4287" />
                <PreSize X="0.7938" Y="0.2828" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/point_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_nickname" ActionTag="-783061879" Tag="784" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-19.0000" RightMargin="-19.0000" TopMargin="100.1000" BottomMargin="-27.1000" FontSize="22" LabelText="_一二三四五_" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="135.0000" Y="26.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-14.1000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.1424" />
                <PreSize X="1.3918" Y="0.2626" />
                <OutlineColor A="255" R="61" G="55" B="55" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_score" CanEdit="False" ActionTag="-902552889" Tag="785" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-1.5000" RightMargin="-1.5000" TopMargin="127.7075" BottomMargin="-55.7075" IsCustomSize="True" FontSize="22" LabelText="88884" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="100.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-42.2075" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.4263" />
                <PreSize X="1.0309" Y="0.2727" />
                <OutlineColor A="255" R="61" G="55" B="55" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="head" ActionTag="758113851" Tag="786" IconVisible="False" LeftMargin="14.2500" RightMargin="18.7500" TopMargin="31.7500" BottomMargin="3.2500" ctype="SpriteObjectData">
                <Size X="64.0000" Y="64.0000" />
                <AnchorPoint />
                <Position X="14.2500" Y="3.2500" />
                <Scale ScaleX="1.0600" ScaleY="1.0600" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1469" Y="0.0328" />
                <PreSize X="0.6598" Y="0.6465" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/transparent_64x64.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="change_sroce_node" ActionTag="-160754772" Tag="787" IconVisible="True" LeftMargin="352.4709" RightMargin="-255.4709" TopMargin="176.3633" BottomMargin="-77.3633" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <AnchorPoint />
                <Position X="352.4709" Y="-77.3633" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="3.6337" Y="-0.7814" />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="offline" ActionTag="1959635662" VisibleForFrame="False" Tag="713" IconVisible="False" LeftMargin="-3.0000" RightMargin="-2.0000" TopMargin="11.0000" BottomMargin="-14.0000" ctype="SpriteObjectData">
                <Size X="102.0000" Y="102.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.0000" Y="37.0000" />
                <Scale ScaleX="0.6700" ScaleY="0.6700" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4948" Y="0.3737" />
                <PreSize X="1.0515" Y="1.0303" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/lixian.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="tuo" ActionTag="1750100407" VisibleForFrame="False" Tag="239" IconVisible="False" LeftMargin="-19.8520" RightMargin="80.8520" TopMargin="63.3633" BottomMargin="-0.3633" ctype="SpriteObjectData">
                <Size X="36.0000" Y="36.0000" />
                <AnchorPoint ScaleX="0.5485" ScaleY="0.4822" />
                <Position X="-0.1060" Y="16.9959" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="-0.0011" Y="0.1717" />
                <PreSize X="0.3711" Y="0.3636" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/icon_tuo.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="head_bg_1" ActionTag="2122007315" VisibleForFrame="False" Tag="789" IconVisible="False" LeftMargin="-1.0256" RightMargin="1.0256" TopMargin="-0.1780" BottomMargin="0.1780" ctype="SpriteObjectData">
                <Size X="97.0000" Y="99.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="47.4744" Y="49.6780" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4894" Y="0.5018" />
                <PreSize X="1.0000" Y="1.0000" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/head_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="ok" ActionTag="-1629165359" VisibleForFrame="False" Tag="790" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="112.4500" RightMargin="-52.4500" TopMargin="41.8500" BottomMargin="12.1500" ctype="SpriteObjectData">
                <Size X="37.0000" Y="45.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="130.9500" Y="34.6500" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="1.3500" Y="0.3500" />
                <PreSize X="0.3814" Y="0.4545" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/ok.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="qp" ActionTag="-1172813961" VisibleForFrame="False" Tag="791" IconVisible="False" LeftMargin="90.1738" RightMargin="-59.1738" TopMargin="76.2384" BottomMargin="-29.2384" ctype="SpriteObjectData">
                <Size X="66.0000" Y="52.0000" />
                <AnchorPoint />
                <Position X="90.1738" Y="-29.2384" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9296" Y="-0.2953" />
                <PreSize X="0.6804" Y="0.5253" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/ltqp3.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="bq" ActionTag="-646846436" VisibleForFrame="False" Tag="341" IconVisible="True" LeftMargin="131.1434" RightMargin="-34.1434" TopMargin="100.3519" BottomMargin="-1.3519" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <AnchorPoint />
                <Position X="131.1434" Y="-1.3519" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="1.3520" Y="-0.0137" />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_piaostate0" ActionTag="-44173707" VisibleForFrame="False" Tag="792" IconVisible="False" LeftMargin="94.4642" RightMargin="-116.4642" TopMargin="67.7006" BottomMargin="-0.7006" ctype="SpriteObjectData">
                <Size X="119.0000" Y="32.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="94.4642" Y="15.2994" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9739" Y="0.1545" />
                <PreSize X="1.2268" Y="0.3232" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_xpz.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_piaostate1" ActionTag="304050661" VisibleForFrame="False" Tag="823" IconVisible="False" LeftMargin="94.4600" RightMargin="-88.4600" TopMargin="67.7000" BottomMargin="-0.7000" ctype="SpriteObjectData">
                <Size X="91.0000" Y="32.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="94.4600" Y="15.3000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9738" Y="0.1545" />
                <PreSize X="0.9381" Y="0.3232" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_yxp.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="zhuang" ActionTag="555271503" VisibleForFrame="False" Tag="793" IconVisible="False" LeftMargin="6.7758" RightMargin="64.2242" TopMargin="71.2587" BottomMargin="0.7413" ctype="SpriteObjectData">
                <Size X="26.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="19.7758" Y="14.2413" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2039" Y="0.1439" />
                <PreSize X="0.2680" Y="0.2727" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/zhuang.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="liang" ActionTag="2053020544" VisibleForFrame="False" Tag="794" IconVisible="False" LeftMargin="64.5000" RightMargin="-2.5000" TopMargin="14.0000" BottomMargin="43.0000" ctype="SpriteObjectData">
                <Size X="35.0000" Y="42.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="82.0000" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8454" Y="0.6465" />
                <PreSize X="0.3608" Y="0.4242" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/liang2.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_bs" ActionTag="1133433947" VisibleForFrame="False" Tag="814" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="35.0000" RightMargin="35.0000" TopMargin="6.5000" BottomMargin="77.5000" LabelText="x892" ctype="TextBMFontObjectData">
                <Size X="27.0000" Y="15.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="85.0000" />
                <Scale ScaleX="0.3700" ScaleY="0.3700" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8586" />
                <PreSize X="0.2784" Y="0.1515" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_bs" ActionTag="1854951366" VisibleForFrame="False" Tag="813" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="17.5000" RightMargin="17.5000" TopMargin="1.0000" BottomMargin="76.0000" ctype="SpriteObjectData">
                <Size X="62.0000" Y="22.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="87.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8788" />
                <PreSize X="0.6392" Y="0.2222" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_jiapiao.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="ti" ActionTag="-1402425685" VisibleForFrame="False" Tag="796" IconVisible="False" LeftMargin="9.1026" RightMargin="8.8974" TopMargin="-20.3842" BottomMargin="50.3842" ctype="SpriteObjectData">
                <Size X="79.0000" Y="69.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.6026" Y="84.8842" />
                <Scale ScaleX="0.8000" ScaleY="0.8000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5011" Y="0.8574" />
                <PreSize X="0.8144" Y="0.6970" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_ti.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="65.0000" Y="482.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.0508" Y="0.6694" />
            <PreSize X="0.0758" Y="0.1375" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/transparent_97x99.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="info1" ActionTag="249826322" Tag="797" IconVisible="False" LeftMargin="1166.5000" RightMargin="16.5000" TopMargin="188.5000" BottomMargin="432.5000" ctype="SpriteObjectData">
            <Size X="97.0000" Y="99.0000" />
            <Children>
              <AbstractNodeData Name="people_bg" ActionTag="1856973197" Tag="798" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-2.5000" RightMargin="-2.5000" TopMargin="10.0400" BottomMargin="-16.0400" ctype="SpriteObjectData">
                <Size X="102.0000" Y="105.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="36.4600" />
                <Scale ScaleX="0.7000" ScaleY="0.7000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.3683" />
                <PreSize X="1.0515" Y="1.0606" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/people_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Sprite_29" ActionTag="-59699872" Tag="799" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="10.0000" RightMargin="10.0000" TopMargin="127.4460" BottomMargin="-56.4460" ctype="SpriteObjectData">
                <Size X="77.0000" Y="28.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-42.4460" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.4287" />
                <PreSize X="0.7938" Y="0.2828" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/point_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_nickname" ActionTag="1453363083" Tag="801" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-19.0000" RightMargin="-19.0000" TopMargin="100.1000" BottomMargin="-27.1000" FontSize="22" LabelText="_一二三四五_" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="135.0000" Y="26.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-14.1000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.1424" />
                <PreSize X="1.3918" Y="0.2626" />
                <OutlineColor A="255" R="61" G="55" B="55" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_score" ActionTag="-966411279" Tag="802" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-1.5000" RightMargin="-1.5000" TopMargin="127.7075" BottomMargin="-55.7075" IsCustomSize="True" FontSize="22" LabelText="88884" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="100.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-42.2075" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.4263" />
                <PreSize X="1.0309" Y="0.2727" />
                <OutlineColor A="255" R="61" G="55" B="55" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="head" ActionTag="240393454" Tag="803" IconVisible="False" LeftMargin="14.2500" RightMargin="18.7500" TopMargin="31.7500" BottomMargin="3.2500" ctype="SpriteObjectData">
                <Size X="64.0000" Y="64.0000" />
                <AnchorPoint />
                <Position X="14.2500" Y="3.2500" />
                <Scale ScaleX="1.0600" ScaleY="1.0600" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1469" Y="0.0328" />
                <PreSize X="0.6598" Y="0.6465" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/transparent_64x64.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="change_sroce_node" ActionTag="-1895679505" Tag="804" IconVisible="True" LeftMargin="-242.0908" RightMargin="339.0908" TopMargin="176.5032" BottomMargin="-77.5032" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <AnchorPoint />
                <Position X="-242.0908" Y="-77.5032" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="-2.4958" Y="-0.7829" />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="offline" ActionTag="-400556454" VisibleForFrame="False" Tag="714" IconVisible="False" LeftMargin="-3.0000" RightMargin="-2.0000" TopMargin="11.0000" BottomMargin="-14.0000" ctype="SpriteObjectData">
                <Size X="102.0000" Y="102.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.0000" Y="37.0000" />
                <Scale ScaleX="0.6700" ScaleY="0.6700" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4948" Y="0.3737" />
                <PreSize X="1.0515" Y="1.0303" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/lixian.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="tuo" ActionTag="227470869" VisibleForFrame="False" Tag="240" IconVisible="False" LeftMargin="79.0457" RightMargin="-18.0457" TopMargin="61.5167" BottomMargin="1.4833" ctype="SpriteObjectData">
                <Size X="36.0000" Y="36.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="97.0457" Y="19.4833" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="1.0005" Y="0.1968" />
                <PreSize X="0.3711" Y="0.3636" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/icon_tuo.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="head_bg_1" ActionTag="-949030227" VisibleForFrame="False" Tag="806" IconVisible="False" LeftMargin="-1.0256" RightMargin="1.0256" TopMargin="-0.1780" BottomMargin="0.1780" ctype="SpriteObjectData">
                <Size X="97.0000" Y="99.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="47.4744" Y="49.6780" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4894" Y="0.5018" />
                <PreSize X="1.0000" Y="1.0000" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/head_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="ok" ActionTag="1898699465" VisibleForFrame="False" Tag="807" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-52.4500" RightMargin="112.4500" TopMargin="41.5000" BottomMargin="12.5000" ctype="SpriteObjectData">
                <Size X="37.0000" Y="45.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-33.9500" Y="35.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="-0.3500" Y="0.3535" />
                <PreSize X="0.3814" Y="0.4545" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/ok.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="qp" ActionTag="-1114274471" VisibleForFrame="False" Tag="808" IconVisible="False" LeftMargin="-73.6155" RightMargin="99.6155" TopMargin="71.5921" BottomMargin="-24.5921" ctype="SpriteObjectData">
                <Size X="71.0000" Y="52.0000" />
                <AnchorPoint ScaleX="1.0000" />
                <Position X="-2.6155" Y="-24.5921" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="-0.0270" Y="-0.2484" />
                <PreSize X="0.7320" Y="0.5253" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/ltqp1.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="bq" ActionTag="-1083100455" VisibleForFrame="False" Tag="342" IconVisible="True" LeftMargin="-45.9386" RightMargin="142.9386" TopMargin="97.2986" BottomMargin="1.7014" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <AnchorPoint />
                <Position X="-45.9386" Y="1.7014" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="-0.4736" Y="0.0172" />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_piaostate0" ActionTag="-1662469167" VisibleForFrame="False" Tag="809" IconVisible="False" LeftMargin="-116.7954" RightMargin="94.7954" TopMargin="67.7005" BottomMargin="-0.7005" ctype="SpriteObjectData">
                <Size X="119.0000" Y="32.0000" />
                <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                <Position X="2.2046" Y="15.2995" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0227" Y="0.1545" />
                <PreSize X="1.2268" Y="0.3232" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_xpz.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_piaostate1" ActionTag="-1578307971" VisibleForFrame="False" Tag="821" IconVisible="False" LeftMargin="-88.8000" RightMargin="94.8000" TopMargin="67.7000" BottomMargin="-0.7000" ctype="SpriteObjectData">
                <Size X="91.0000" Y="32.0000" />
                <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                <Position X="2.2000" Y="15.3000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0227" Y="0.1545" />
                <PreSize X="0.9381" Y="0.3232" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_yxp.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="zhuang" ActionTag="-2118126796" VisibleForFrame="False" Tag="810" IconVisible="False" LeftMargin="63.8245" RightMargin="7.1755" TopMargin="71.2586" BottomMargin="0.7414" ctype="SpriteObjectData">
                <Size X="26.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="76.8245" Y="14.2414" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7920" Y="0.1439" />
                <PreSize X="0.2680" Y="0.2727" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/zhuang.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="liang" ActionTag="1736395471" VisibleForFrame="False" Tag="811" IconVisible="False" LeftMargin="-5.8000" RightMargin="67.8000" TopMargin="7.0100" BottomMargin="49.9900" ctype="SpriteObjectData">
                <Size X="35.0000" Y="42.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="11.7000" Y="70.9900" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1206" Y="0.7171" />
                <PreSize X="0.3608" Y="0.4242" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/liang2.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_bs" ActionTag="1705501949" VisibleForFrame="False" Tag="816" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="17.5000" RightMargin="17.5000" TopMargin="1.0000" BottomMargin="76.0000" ctype="SpriteObjectData">
                <Size X="62.0000" Y="22.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="87.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8788" />
                <PreSize X="0.6392" Y="0.2222" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_jiapiao.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_bs" ActionTag="-598196616" VisibleForFrame="False" Tag="815" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="35.0000" RightMargin="35.0000" TopMargin="6.5000" BottomMargin="77.5000" LabelText="x892" ctype="TextBMFontObjectData">
                <Size X="27.0000" Y="15.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="85.0000" />
                <Scale ScaleX="0.3700" ScaleY="0.3700" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8586" />
                <PreSize X="0.2784" Y="0.1515" />
              </AbstractNodeData>
              <AbstractNodeData Name="ti" ActionTag="-1069508407" VisibleForFrame="False" Tag="813" IconVisible="False" LeftMargin="9.1026" RightMargin="8.8974" TopMargin="-20.3842" BottomMargin="50.3842" ctype="SpriteObjectData">
                <Size X="79.0000" Y="69.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.6026" Y="84.8842" />
                <Scale ScaleX="0.8000" ScaleY="0.8000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5011" Y="0.8574" />
                <PreSize X="0.8144" Y="0.6970" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_ti.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1215.0000" Y="482.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9492" Y="0.6694" />
            <PreSize X="0.0758" Y="0.1375" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/transparent_97x99.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="info0" ActionTag="-178887057" Tag="824" IconVisible="False" LeftMargin="205.5177" RightMargin="977.4823" TopMargin="33.7109" BottomMargin="587.2891" ctype="SpriteObjectData">
            <Size X="97.0000" Y="99.0000" />
            <Children>
              <AbstractNodeData Name="people_bg" ActionTag="695065805" Tag="825" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-2.5000" RightMargin="-2.5000" TopMargin="10.0400" BottomMargin="-16.0400" ctype="SpriteObjectData">
                <Size X="102.0000" Y="105.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="36.4600" />
                <Scale ScaleX="0.7000" ScaleY="0.7000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.3683" />
                <PreSize X="1.0515" Y="1.0606" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/people_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Sprite_29" ActionTag="-1880858852" Tag="826" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="10.0000" RightMargin="10.0000" TopMargin="127.4460" BottomMargin="-56.4460" ctype="SpriteObjectData">
                <Size X="77.0000" Y="28.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-42.4460" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.4287" />
                <PreSize X="0.7938" Y="0.2828" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/point_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_nickname" ActionTag="236612659" Tag="828" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-19.0000" RightMargin="-19.0000" TopMargin="100.1000" BottomMargin="-27.1000" FontSize="22" LabelText="_一二三四五_" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="135.0000" Y="26.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-14.1000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.1424" />
                <PreSize X="1.3918" Y="0.2626" />
                <OutlineColor A="255" R="61" G="55" B="55" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_score" ActionTag="-2052937832" Tag="829" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-1.5000" RightMargin="-1.5000" TopMargin="127.7075" BottomMargin="-55.7075" IsCustomSize="True" FontSize="22" LabelText="88884" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="100.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-42.2075" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.4263" />
                <PreSize X="1.0309" Y="0.2727" />
                <OutlineColor A="255" R="61" G="55" B="55" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="head" ActionTag="-1798885212" Tag="830" IconVisible="False" LeftMargin="14.2500" RightMargin="18.7500" TopMargin="31.7500" BottomMargin="3.2500" ctype="SpriteObjectData">
                <Size X="64.0000" Y="64.0000" />
                <AnchorPoint />
                <Position X="14.2500" Y="3.2500" />
                <Scale ScaleX="1.0600" ScaleY="1.0600" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1469" Y="0.0328" />
                <PreSize X="0.6598" Y="0.6465" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/transparent_64x64.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="change_sroce_node" ActionTag="1235859714" Tag="831" IconVisible="True" LeftMargin="437.8210" RightMargin="-340.8210" TopMargin="163.7335" BottomMargin="-64.7335" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <AnchorPoint />
                <Position X="437.8210" Y="-64.7335" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="4.5136" Y="-0.6539" />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="offline" ActionTag="50898919" VisibleForFrame="False" Tag="715" IconVisible="False" LeftMargin="-3.0000" RightMargin="-2.0000" TopMargin="11.0000" BottomMargin="-14.0000" ctype="SpriteObjectData">
                <Size X="102.0000" Y="102.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.0000" Y="37.0000" />
                <Scale ScaleX="0.6700" ScaleY="0.6700" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4948" Y="0.3737" />
                <PreSize X="1.0515" Y="1.0303" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/lixian.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="tuo" ActionTag="-1281606719" VisibleForFrame="False" Tag="241" IconVisible="False" LeftMargin="-20.5544" RightMargin="81.5544" TopMargin="62.6339" BottomMargin="0.3661" ctype="SpriteObjectData">
                <Size X="36.0000" Y="36.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-2.5544" Y="18.3661" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="-0.0263" Y="0.1855" />
                <PreSize X="0.3711" Y="0.3636" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/icon_tuo.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="head_bg_1" ActionTag="-1444277159" VisibleForFrame="False" Tag="833" IconVisible="False" LeftMargin="-1.0256" RightMargin="1.0256" TopMargin="-0.1780" BottomMargin="0.1780" ctype="SpriteObjectData">
                <Size X="97.0000" Y="99.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="47.4744" Y="49.6780" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4894" Y="0.5018" />
                <PreSize X="1.0000" Y="1.0000" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/head_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="ok" ActionTag="-676485402" VisibleForFrame="False" Tag="834" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="30.0000" RightMargin="30.0000" TopMargin="162.5000" BottomMargin="-108.5000" ctype="SpriteObjectData">
                <Size X="37.0000" Y="45.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="-86.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.8687" />
                <PreSize X="0.3814" Y="0.4545" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/ok.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="qp" ActionTag="1705660866" VisibleForFrame="False" Tag="835" IconVisible="False" LeftMargin="82.6700" RightMargin="-55.6700" TopMargin="106.0577" BottomMargin="-71.0577" ctype="SpriteObjectData">
                <Size X="70.0000" Y="64.0000" />
                <AnchorPoint />
                <Position X="82.6700" Y="-71.0577" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8523" Y="-0.7178" />
                <PreSize X="0.7216" Y="0.6465" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/ltqp0.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="bq" ActionTag="383990245" VisibleForFrame="False" Tag="343" IconVisible="True" LeftMargin="115.6986" RightMargin="-18.6986" TopMargin="139.8347" BottomMargin="-40.8347" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <AnchorPoint />
                <Position X="115.6986" Y="-40.8347" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="1.1928" Y="-0.4125" />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_piaostate0" ActionTag="457479134" VisibleForFrame="False" Tag="836" IconVisible="False" LeftMargin="94.4600" RightMargin="-116.4600" TopMargin="67.7006" BottomMargin="-0.7006" ctype="SpriteObjectData">
                <Size X="119.0000" Y="32.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="94.4600" Y="15.2994" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9738" Y="0.1545" />
                <PreSize X="1.2268" Y="0.3232" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_xpz.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_piaostate1" ActionTag="-1326763354" VisibleForFrame="False" Tag="837" IconVisible="False" LeftMargin="94.4600" RightMargin="-88.4600" TopMargin="67.7000" BottomMargin="-0.7000" ctype="SpriteObjectData">
                <Size X="91.0000" Y="32.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="94.4600" Y="15.3000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9738" Y="0.1545" />
                <PreSize X="0.9381" Y="0.3232" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_yxp.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="zhuang" ActionTag="700586317" VisibleForFrame="False" Tag="838" IconVisible="False" LeftMargin="6.7758" RightMargin="64.2242" TopMargin="71.2587" BottomMargin="0.7413" ctype="SpriteObjectData">
                <Size X="26.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="19.7758" Y="14.2413" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2039" Y="0.1439" />
                <PreSize X="0.2680" Y="0.2727" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/zhuang.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="liang" ActionTag="-75081847" VisibleForFrame="False" Tag="839" IconVisible="False" LeftMargin="64.5000" RightMargin="-2.5000" TopMargin="14.0000" BottomMargin="43.0000" ctype="SpriteObjectData">
                <Size X="35.0000" Y="42.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="82.0000" Y="64.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8454" Y="0.6465" />
                <PreSize X="0.3608" Y="0.4242" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/liang2.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_bs" ActionTag="-425141816" VisibleForFrame="False" Tag="818" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="35.0000" RightMargin="35.0000" TopMargin="6.5000" BottomMargin="77.5000" LabelText="x892" ctype="TextBMFontObjectData">
                <Size X="27.0000" Y="15.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="85.0000" />
                <Scale ScaleX="0.3700" ScaleY="0.3700" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8586" />
                <PreSize X="0.2784" Y="0.1515" />
              </AbstractNodeData>
              <AbstractNodeData Name="sp_bs" ActionTag="716984030" VisibleForFrame="False" Tag="817" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="17.5000" RightMargin="17.5000" TopMargin="1.0000" BottomMargin="76.0000" ctype="SpriteObjectData">
                <Size X="62.0000" Y="22.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.5000" Y="87.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8788" />
                <PreSize X="0.6392" Y="0.2222" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/word_jiapiao.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="ti" ActionTag="1109157056" VisibleForFrame="False" Tag="841" IconVisible="False" LeftMargin="9.1026" RightMargin="8.8974" TopMargin="-20.3842" BottomMargin="50.3842" ctype="SpriteObjectData">
                <Size X="79.0000" Y="69.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="48.6026" Y="84.8842" />
                <Scale ScaleX="0.8000" ScaleY="0.8000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5011" Y="0.8574" />
                <PreSize X="0.8144" Y="0.6970" />
                <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_ti.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="254.0177" Y="636.7891" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.1985" Y="0.8844" />
            <PreSize X="0.0758" Y="0.1375" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/transparent_97x99.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="ting_quxiao" ActionTag="-1308465366" VisibleForFrame="False" Tag="725" IconVisible="False" LeftMargin="344.7900" RightMargin="711.2100" TopMargin="367.0000" BottomMargin="277.0000" ctype="SpriteObjectData">
            <Size X="224.0000" Y="76.0000" />
            <Children>
              <AbstractNodeData Name="Text_22_0" ActionTag="-100157309" Tag="264" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="33.6448" RightMargin="30.3552" TopMargin="15.9490" BottomMargin="15.0510" FontSize="40" LabelText="取消选择" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="160.0000" Y="45.0000" />
                <AnchorPoint ScaleX="0.4963" ScaleY="0.4762" />
                <Position X="113.0528" Y="36.4800" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5047" Y="0.4800" />
                <PreSize X="0.7143" Y="0.5921" />
                <OutlineColor A="255" R="255" G="255" B="255" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="456.7900" Y="315.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.3569" Y="0.4375" />
            <PreSize X="0.1750" Y="0.1056" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_bg_orange.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_auto" ActionTag="1880841459" Tag="237" IconVisible="False" LeftMargin="1188.9359" RightMargin="27.0641" TopMargin="346.0743" BottomMargin="309.9257" ctype="SpriteObjectData">
            <Size X="64.0000" Y="64.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1220.9359" Y="341.9257" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9539" Y="0.4749" />
            <PreSize X="0.0500" Y="0.0889" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/auto.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="lockLocation" ActionTag="655770018" Tag="692" IconVisible="False" LeftMargin="-19.9532" RightMargin="1057.9532" TopMargin="62.8167" BottomMargin="575.1833" ctype="SpriteObjectData">
            <Size X="242.0000" Y="82.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="101.0468" Y="616.1833" />
            <Scale ScaleX="0.8000" ScaleY="0.8000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.0789" Y="0.8558" />
            <PreSize X="0.1891" Y="0.1139" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/btn_locklocation.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="tishiguojin" ActionTag="58768204" VisibleForFrame="False" Tag="694" IconVisible="False" LeftMargin="380.0000" RightMargin="380.0000" TopMargin="141.0000" BottomMargin="547.0000" Scale9Enable="True" LeftEage="51" RightEage="51" TopEage="10" BottomEage="10" Scale9OriginX="51" Scale9OriginY="10" Scale9Width="55" Scale9Height="12" ctype="ImageViewObjectData">
            <Size X="520.0000" Y="32.0000" />
            <Children>
              <AbstractNodeData Name="Text_1" ActionTag="-1154033162" Tag="695" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="7.0000" RightMargin="7.0000" TopMargin="3.0000" BottomMargin="3.0000" FontSize="22" LabelText="当前牌桌中有玩家距离过近，在查看定位中了解详情" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="506.0000" Y="26.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="260.0000" Y="16.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="0" B="0" />
                <PrePosition X="0.5000" Y="0.5000" />
                <PreSize X="0.9731" Y="0.8125" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="563.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.7819" />
            <PreSize X="0.4063" Y="0.0444" />
            <FileData Type="Normal" Path="submodules/majiang/image/MaScene_KWX/round_rect_157.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="effectemoji1" ActionTag="-875493942" Tag="458" IconVisible="True" LeftMargin="1215.7456" RightMargin="64.2544" TopMargin="260.5897" BottomMargin="459.4103" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="1215.7456" Y="459.4103" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9498" Y="0.6381" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="effectemoji2" ActionTag="-1952004521" Tag="457" IconVisible="True" LeftMargin="66.5340" RightMargin="1213.4661" TopMargin="492.0594" BottomMargin="227.9406" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="66.5340" Y="227.9406" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.0520" Y="0.3166" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="effectemoji3" ActionTag="-1763261392" Tag="459" IconVisible="True" LeftMargin="64.2678" RightMargin="1215.7322" TopMargin="270.5871" BottomMargin="449.4129" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="64.2678" Y="449.4129" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.0502" Y="0.6242" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="effectemoji0" ActionTag="-1250905534" Tag="460" IconVisible="True" LeftMargin="1080.0000" RightMargin="200.0000" TopMargin="116.1281" BottomMargin="603.8719" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="1080.0000" Y="603.8719" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8438" Y="0.8387" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>