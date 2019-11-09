<GameFile>
  <PropertyGroup Name="Login" Type="Scene" ID="5fdaac8f-f7c1-42e0-ad74-20e8ef3b4f2c" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Scene" Tag="3" ctype="GameNodeObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="bg" ActionTag="126308149" Tag="521" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-140.0000" RightMargin="-140.0000" ctype="SpriteObjectData">
            <Size X="1560.0000" Y="720.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="1.2188" Y="1.0000" />
            <FileData Type="Normal" Path="image/ui/login/bg.jpg" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="xieyi" ActionTag="-118462547" Tag="128" IconVisible="True" LeftMargin="449.7704" RightMargin="830.2296" TopMargin="646.2116" BottomMargin="73.7884" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <Children>
              <AbstractNodeData Name="login_xieyi_3" ActionTag="-75123312" Tag="176" IconVisible="False" LeftMargin="8.5512" RightMargin="-437.5512" TopMargin="-22.9245" BottomMargin="-22.0755" ctype="SpriteObjectData">
                <Size X="429.0000" Y="45.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="223.0512" Y="0.4245" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="image/ui/login/login_xieyi.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="cbBox" ActionTag="1930797208" Tag="21" IconVisible="False" LeftMargin="97.8611" RightMargin="-124.8611" TopMargin="-12.5000" BottomMargin="-14.5000" TouchEnable="True" CheckedState="True" ctype="CheckBoxObjectData">
                <Size X="27.0000" Y="27.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="111.3611" Y="-1.0000" />
                <Scale ScaleX="1.5000" ScaleY="1.5000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <NormalBackFileData Type="Normal" Path="appCommon/fydp/common/checkbg.png" Plist="" />
                <PressedBackFileData Type="Normal" Path="appCommon/fydp/common/checkbg.png" Plist="" />
                <DisableBackFileData Type="Normal" Path="appCommon/fydp/common/checkbg.png" Plist="" />
                <NodeNormalFileData Type="Normal" Path="appCommon/fydp/common/check.png" Plist="" />
                <NodeDisableFileData Type="Normal" Path="appCommon/fydp/common/check.png" Plist="" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position X="449.7704" Y="73.7884" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.3514" Y="0.1025" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="btGuest" ActionTag="-317196026" Tag="123" IconVisible="False" LeftMargin="482.5000" RightMargin="482.5000" TopMargin="510.7158" BottomMargin="111.2842" ctype="SpriteObjectData">
            <Size X="315.0000" Y="98.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="160.2842" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.2226" />
            <PreSize X="0.2461" Y="0.1361" />
            <FileData Type="Normal" Path="image/ui/login/btguest.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btWeiXin" ActionTag="-628772851" Tag="124" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="475.6720" RightMargin="482.3280" TopMargin="501.2742" BottomMargin="114.7258" ctype="SpriteObjectData">
            <Size X="322.0000" Y="104.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="636.6720" Y="166.7258" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.4974" Y="0.2316" />
            <PreSize X="0.2516" Y="0.1444" />
            <FileData Type="Normal" Path="image/ui/login/btweixin.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="tfUserId" ActionTag="396011228" Tag="170" IconVisible="False" LeftMargin="802.0947" RightMargin="277.9053" TopMargin="623.7397" BottomMargin="56.2603" TouchEnable="True" FontSize="30" IsCustomSize="True" LabelText="" PlaceHolderText="输入登陆ID" MaxLengthText="10" ctype="TextFieldObjectData">
            <Size X="200.0000" Y="40.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="902.0947" Y="76.2603" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.7048" Y="0.1059" />
            <PreSize X="0.1563" Y="0.0556" />
          </AbstractNodeData>
          <AbstractNodeData Name="version" ActionTag="1554148841" VisibleForFrame="False" Tag="83" IconVisible="False" LeftMargin="1151.7698" RightMargin="12.2302" TopMargin="649.5191" BottomMargin="45.4809" FontSize="22" LabelText="88.88.88.88" HorizontalAlignmentType="HT_Right" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="116.0000" Y="25.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1209.7698" Y="57.9809" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9451" Y="0.0805" />
            <PreSize X="0.0906" Y="0.0347" />
            <FontResource Type="Normal" Path="image/fonts/FZZY.TTF" Plist="" />
            <OutlineColor A="255" R="0" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="progress_bg" ActionTag="-792642672" VisibleForFrame="False" Tag="9" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="297.5000" RightMargin="297.5000" TopMargin="579.7862" BottomMargin="109.2138" ctype="SpriteObjectData">
            <Size X="685.0000" Y="31.0000" />
            <Children>
              <AbstractNodeData Name="progress" ActionTag="159709878" Tag="11" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-78.5000" RightMargin="-78.5000" TopMargin="-19.4989" BottomMargin="26.4989" ProgressInfo="36" ctype="LoadingBarObjectData">
                <Size X="842.0000" Y="24.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="342.5000" Y="38.4989" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="1.2419" />
                <PreSize X="1.2292" Y="0.7742" />
                <ImageFileData Type="Normal" Path="image/ui/login/equipupgrade_progress_.png" Plist="" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="124.7138" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.1732" />
            <PreSize X="0.5352" Y="0.0431" />
            <FileData Type="Normal" Path="image/ui/login/equipupgrade_progress_b.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="progress_label" ActionTag="1915693687" VisibleForFrame="False" Tag="12" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="134.0000" RightMargin="134.0000" TopMargin="546.5000" BottomMargin="146.5000" FontSize="24" LabelText="____________________________________正在检查更新____________________________________" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="1.0000" ShadowOffsetY="-1.0000" ShadowEnabled="True" ctype="TextObjectData">
            <Size X="1012.0000" Y="27.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="160.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="28" G="28" B="28" />
            <PrePosition X="0.5000" Y="0.2222" />
            <PreSize X="0.7906" Y="0.0375" />
            <FontResource Type="Normal" Path="image/fonts/FZZY.TTF" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_refresh" ActionTag="-2075675153" Tag="174" IconVisible="False" LeftMargin="7.0000" RightMargin="1197.0000" TopMargin="9.0000" BottomMargin="629.0000" ctype="SpriteObjectData">
            <Size X="76.0000" Y="82.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="45.0000" Y="670.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.0352" Y="0.9306" />
            <PreSize X="0.0594" Y="0.1139" />
            <FileData Type="Normal" Path="image/ui/login/reset.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="login_tip_2" ActionTag="-1822997286" Tag="175" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-140.0000" RightMargin="-140.0000" TopMargin="694.0000" ctype="SpriteObjectData">
            <Size X="1560.0000" Y="26.0000" />
            <AnchorPoint ScaleX="0.5000" />
            <Position X="640.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" />
            <PreSize X="1.2188" Y="0.0361" />
            <FileData Type="Normal" Path="image/ui/login/login_tip.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="login_title_12" ActionTag="-478444335" Tag="127" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="201.5000" RightMargin="201.5000" TopMargin="142.5548" BottomMargin="284.4452" ctype="SpriteObjectData">
            <Size X="877.0000" Y="293.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5036" />
            <Position X="640.0000" Y="432.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.6000" />
            <PreSize X="0.6852" Y="0.4069" />
            <FileData Type="Normal" Path="image/ui/login/login_title.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btXianLiao" ActionTag="-2055894927" Tag="16" IconVisible="False" LeftMargin="832.2300" RightMargin="125.7700" TopMargin="501.2742" BottomMargin="114.7258" ctype="SpriteObjectData">
            <Size X="322.0000" Y="104.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="993.2300" Y="166.7258" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.7760" Y="0.2316" />
            <PreSize X="0.2516" Y="0.1444" />
            <FileData Type="Normal" Path="image/ui/login/btxianliao.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btLiaobei" ActionTag="-634887974" Tag="17" IconVisible="False" LeftMargin="119.0300" RightMargin="838.9700" TopMargin="501.2742" BottomMargin="114.7258" ctype="SpriteObjectData">
            <Size X="322.0000" Y="104.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="280.0300" Y="166.7258" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2188" Y="0.2316" />
            <PreSize X="0.2516" Y="0.1444" />
            <FileData Type="Normal" Path="image/ui/login/btn_liaobei.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_youke4" ActionTag="900364003" Tag="188" IconVisible="False" LeftMargin="119.1888" RightMargin="845.8112" TopMargin="337.0309" BottomMargin="284.9691" ctype="SpriteObjectData">
            <Size X="315.0000" Y="98.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="276.6888" Y="333.9691" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2162" Y="0.4638" />
            <PreSize X="0.2461" Y="0.1361" />
            <FileData Type="Normal" Path="image/ui/login/btguest.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_youke3" ActionTag="1236543010" Tag="189" IconVisible="False" LeftMargin="118.0352" RightMargin="846.9648" TopMargin="226.7733" BottomMargin="395.2267" ctype="SpriteObjectData">
            <Size X="315.0000" Y="98.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="275.5352" Y="444.2267" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2153" Y="0.6170" />
            <PreSize X="0.2461" Y="0.1361" />
            <FileData Type="Normal" Path="image/ui/login/btguest.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_youke2" ActionTag="47020190" Tag="190" IconVisible="False" LeftMargin="116.8815" RightMargin="848.1185" TopMargin="119.4646" BottomMargin="502.5354" ctype="SpriteObjectData">
            <Size X="315.0000" Y="98.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="274.3815" Y="551.5354" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2144" Y="0.7660" />
            <PreSize X="0.2461" Y="0.1361" />
            <FileData Type="Normal" Path="image/ui/login/btguest.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="btn_youke1" ActionTag="-1331914776" Tag="191" IconVisible="False" LeftMargin="111.3050" RightMargin="853.6950" TopMargin="14.1443" BottomMargin="607.8557" ctype="SpriteObjectData">
            <Size X="315.0000" Y="98.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="268.8050" Y="656.8557" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2100" Y="0.9123" />
            <PreSize X="0.2461" Y="0.1361" />
            <FileData Type="Normal" Path="image/ui/login/btguest.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>