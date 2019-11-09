<GameFile>
  <PropertyGroup Name="ShopLayer" Type="Layer" ID="f8bc76f4-ff67-4a10-9375-ba713a6cd65e" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Scene" Tag="193" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="root" ActionTag="1811674520" Tag="194" IconVisible="False" TouchEnable="True" ClipAble="False" BackColorAlpha="153" ColorAngle="90.0000" LeftEage="367" RightEage="367" TopEage="225" BottomEage="225" Scale9OriginX="-367" Scale9OriginY="-225" Scale9Width="734" Scale9Height="450" ctype="PanelObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <Children>
              <AbstractNodeData Name="bg" ActionTag="-372800364" Tag="195" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="175.0000" RightMargin="175.0000" TopMargin="27.5000" BottomMargin="27.5000" ctype="SpriteObjectData">
                <Size X="930.0000" Y="665.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="360.0000" />
                <Scale ScaleX="0.9000" ScaleY="0.9000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.5000" />
                <PreSize X="0.7266" Y="0.9236" />
                <FileData Type="Normal" Path="image/ui/shop/shop_bg.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="close" ActionTag="368238018" Tag="196" IconVisible="False" LeftMargin="936.0495" RightMargin="266.9505" TopMargin="73.8945" BottomMargin="571.1055" ctype="SpriteObjectData">
                <Size X="77.0000" Y="75.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="974.5495" Y="608.6055" />
                <Scale ScaleX="1.2000" ScaleY="1.2000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7614" Y="0.8453" />
                <PreSize X="0.0602" Y="0.1042" />
                <FileData Type="Normal" Path="image/ui/room/btClose.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="buy" ActionTag="-28853029" Tag="198" IconVisible="False" LeftMargin="522.5000" RightMargin="522.5000" TopMargin="575.3480" BottomMargin="60.6520" ctype="SpriteObjectData">
                <Size X="235.0000" Y="84.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="102.6520" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.1426" />
                <PreSize X="0.1836" Y="0.1167" />
                <FileData Type="Normal" Path="image/ui/shop/shop_ljgm.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="fk3" ActionTag="-704800501" Tag="199" IconVisible="False" LeftMargin="805.6824" RightMargin="277.3176" TopMargin="278.6409" BottomMargin="302.3591" ctype="SpriteObjectData">
                <Size X="197.0000" Y="139.0000" />
                <Children>
                  <AbstractNodeData Name="light" ActionTag="-711578671" Tag="200" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-43.5214" RightMargin="-44.4786" TopMargin="-88.3994" BottomMargin="-139.6006" ctype="SpriteObjectData">
                    <Size X="285.0000" Y="367.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="98.9786" Y="43.8994" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5024" Y="0.3158" />
                    <PreSize X="1.4467" Y="2.6403" />
                    <FileData Type="Normal" Path="image/ui/shop/shop_light.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="card" ActionTag="963847047" Tag="201" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="0.8134" RightMargin="-2.8134" TopMargin="-61.8055" BottomMargin="157.8055" FontSize="38" LabelText="房卡0000张" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="199.0000" Y="43.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="100.3134" Y="179.3055" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="237" G="109" B="52" />
                    <PrePosition X="0.5092" Y="1.2900" />
                    <PreSize X="1.0102" Y="0.3094" />
                    <FontResource Type="Default" Path="" Plist="" />
                    <OutlineColor A="255" R="100" G="57" B="4" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="money" ActionTag="752439576" Tag="202" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="35.7438" RightMargin="38.2562" TopMargin="202.3096" BottomMargin="-106.3096" FontSize="38" LabelText="0000元" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="123.0000" Y="43.0000" />
                    <AnchorPoint ScaleX="0.5456" ScaleY="0.3780" />
                    <Position X="102.8526" Y="-90.0556" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="207" G="75" B="17" />
                    <PrePosition X="0.5221" Y="-0.6479" />
                    <PreSize X="0.6244" Y="0.3094" />
                    <FontResource Type="Default" Path="" Plist="" />
                    <OutlineColor A="255" R="255" G="255" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="904.1824" Y="371.8591" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7064" Y="0.5165" />
                <PreSize X="0.1539" Y="0.1931" />
                <FileData Type="Normal" Path="image/ui/shop/shop_fk3.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="fk2" ActionTag="1178238704" Tag="203" IconVisible="False" LeftMargin="540.0491" RightMargin="552.9509" TopMargin="277.8066" BottomMargin="304.1934" ctype="SpriteObjectData">
                <Size X="187.0000" Y="138.0000" />
                <Children>
                  <AbstractNodeData Name="light" ActionTag="-889381088" Tag="204" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-40.8526" RightMargin="-57.1474" TopMargin="-84.0617" BottomMargin="-144.9383" ctype="SpriteObjectData">
                    <Size X="285.0000" Y="367.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="101.6474" Y="38.5617" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5436" Y="0.2794" />
                    <PreSize X="1.5241" Y="2.6594" />
                    <FileData Type="Normal" Path="image/ui/shop/shop_light.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="card" ActionTag="-1523764258" Tag="205" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-7.1928" RightMargin="-4.8072" TopMargin="-58.8019" BottomMargin="153.8019" FontSize="38" LabelText="房卡0000张" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="199.0000" Y="43.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="92.3072" Y="175.3019" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="237" G="109" B="52" />
                    <PrePosition X="0.4936" Y="1.2703" />
                    <PreSize X="1.0642" Y="0.3116" />
                    <FontResource Type="Default" Path="" Plist="" />
                    <OutlineColor A="255" R="100" G="57" B="4" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="money" ActionTag="-1432637278" Tag="206" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="30.6654" RightMargin="33.3346" TopMargin="209.3127" BottomMargin="-114.3127" FontSize="38" LabelText="0000元" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="123.0000" Y="43.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="92.1654" Y="-92.8127" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="207" G="75" B="17" />
                    <PrePosition X="0.4929" Y="-0.6726" />
                    <PreSize X="0.6578" Y="0.3116" />
                    <FontResource Type="Default" Path="" Plist="" />
                    <OutlineColor A="255" R="255" G="255" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="633.5491" Y="373.1934" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4950" Y="0.5183" />
                <PreSize X="0.1461" Y="0.1917" />
                <FileData Type="Normal" Path="image/ui/shop/shop_fk2.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="fk1" ActionTag="-1069522278" Tag="207" IconVisible="False" LeftMargin="289.2690" RightMargin="808.7310" TopMargin="297.4882" BottomMargin="286.5118" ctype="SpriteObjectData">
                <Size X="182.0000" Y="136.0000" />
                <Children>
                  <AbstractNodeData Name="light" ActionTag="48831549" Tag="208" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-50.1930" RightMargin="-52.8070" TopMargin="-104.7427" BottomMargin="-126.2573" ctype="SpriteObjectData">
                    <Size X="285.0000" Y="367.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="92.3070" Y="57.2427" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5072" Y="0.4209" />
                    <PreSize X="1.5659" Y="2.6985" />
                    <FileData Type="Normal" Path="image/ui/shop/shop_light.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="card" ActionTag="-1273573040" Tag="209" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-15.1986" RightMargin="-1.8014" TopMargin="-79.4828" BottomMargin="172.4828" FontSize="38" LabelText="房卡0000张" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="199.0000" Y="43.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="84.3014" Y="193.9828" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="237" G="109" B="52" />
                    <PrePosition X="0.4632" Y="1.4263" />
                    <PreSize X="1.0934" Y="0.3162" />
                    <FontResource Type="Default" Path="" Plist="" />
                    <OutlineColor A="255" R="100" G="57" B="4" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="money" ActionTag="-1675845335" Tag="210" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="26.8321" RightMargin="32.1679" TopMargin="187.2977" BottomMargin="-94.2977" FontSize="38" LabelText="0000元" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="123.0000" Y="43.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="88.3321" Y="-72.7977" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="207" G="75" B="17" />
                    <PrePosition X="0.4853" Y="-0.5353" />
                    <PreSize X="0.6758" Y="0.3162" />
                    <FontResource Type="Default" Path="" Plist="" />
                    <OutlineColor A="255" R="255" G="255" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="touch" ActionTag="-2108280294" Tag="60" IconVisible="False" LeftMargin="-27.2697" RightMargin="-30.7303" TopMargin="-70.7177" BottomMargin="-93.2823" Scale9Enable="True" LeftEage="21" RightEage="21" TopEage="21" BottomEage="21" Scale9OriginX="21" Scale9OriginY="21" Scale9Width="22" Scale9Height="22" ctype="ImageViewObjectData">
                    <Size X="240.0000" Y="300.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="92.7303" Y="56.7177" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5095" Y="0.4170" />
                    <PreSize X="1.3187" Y="2.2059" />
                    <FileData Type="Normal" Path="appCommon/fydp/common/transparent/transparent_64x64.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="380.2690" Y="354.5118" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2971" Y="0.4924" />
                <PreSize X="0.1422" Y="0.1889" />
                <FileData Type="Normal" Path="image/ui/shop/shop_fk1.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
            </Children>
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
          <AbstractNodeData Name="title_1" ActionTag="494790039" Tag="39" IconVisible="False" LeftMargin="586.4163" RightMargin="584.5837" TopMargin="81.9241" BottomMargin="585.0759" ctype="SpriteObjectData">
            <Size X="109.0000" Y="53.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.9163" Y="611.5759" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5007" Y="0.8494" />
            <PreSize X="0.0852" Y="0.0736" />
            <FileData Type="Normal" Path="image/ui/shop/title.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="touch1" ActionTag="-1859053960" Tag="59" IconVisible="False" LeftMargin="260.2908" RightMargin="779.7092" TopMargin="229.7404" BottomMargin="190.2596" Scale9Enable="True" LeftEage="21" RightEage="21" TopEage="21" BottomEage="21" Scale9OriginX="21" Scale9OriginY="21" Scale9Width="22" Scale9Height="22" ctype="ImageViewObjectData">
            <Size X="240.0000" Y="300.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="380.2908" Y="340.2596" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2971" Y="0.4726" />
            <PreSize X="0.1875" Y="0.4167" />
            <FileData Type="Normal" Path="appCommon/fydp/common/transparent/transparent_64x64.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="touch2" ActionTag="1465476492" Tag="61" IconVisible="False" LeftMargin="524.4774" RightMargin="515.5226" TopMargin="231.0592" BottomMargin="188.9408" Scale9Enable="True" LeftEage="21" RightEage="21" TopEage="21" BottomEage="21" Scale9OriginX="21" Scale9OriginY="21" Scale9Width="22" Scale9Height="22" ctype="ImageViewObjectData">
            <Size X="240.0000" Y="300.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="644.4774" Y="338.9408" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5035" Y="0.4708" />
            <PreSize X="0.1875" Y="0.4167" />
            <FileData Type="Normal" Path="appCommon/fydp/common/transparent/transparent_64x64.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="touch3" ActionTag="-1891242931" Tag="83" IconVisible="False" LeftMargin="786.6703" RightMargin="253.3297" TopMargin="227.7158" BottomMargin="192.2842" Scale9Enable="True" LeftEage="21" RightEage="21" TopEage="21" BottomEage="21" Scale9OriginX="21" Scale9OriginY="21" Scale9Width="22" Scale9Height="22" ctype="ImageViewObjectData">
            <Size X="240.0000" Y="300.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="906.6703" Y="342.2842" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.7083" Y="0.4754" />
            <PreSize X="0.1875" Y="0.4167" />
            <FileData Type="Normal" Path="appCommon/fydp/common/transparent/transparent_64x64.png" Plist="" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>