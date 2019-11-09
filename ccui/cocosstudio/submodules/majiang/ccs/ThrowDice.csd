<GameFile>
  <PropertyGroup Name="ThrowDice" Type="Scene" ID="73fca55e-118b-42d4-9ac3-4f78f5a1f5a7" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Scene" ctype="GameNodeObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="root" ActionTag="919516530" Tag="282" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <Children>
              <AbstractNodeData Name="bg" ActionTag="-1581172135" Tag="1096" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="480.0000" RightMargin="480.0000" TopMargin="160.0000" BottomMargin="160.0000" Scale9Enable="True" LeftEage="116" RightEage="116" TopEage="61" BottomEage="61" Scale9OriginX="116" Scale9OriginY="61" Scale9Width="296" Scale9Height="73" ctype="ImageViewObjectData">
                <Size X="320.0000" Y="400.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="360.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.5000" />
                <PreSize X="0.2500" Y="0.5556" />
                <FileData Type="Normal" Path="appCommon/fydp/common/player_info_bg.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="dice" ActionTag="-1285860949" Tag="35" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="517.0400" RightMargin="662.9600" TopMargin="244.0000" BottomMargin="376.0000" ctype="SpriteObjectData">
                <Size X="100.0000" Y="100.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="567.0400" Y="426.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4430" Y="0.5917" />
                <PreSize X="0.0781" Y="0.1389" />
                <FileData Type="PlistSubImage" Path="dice_Action_3.png" Plist="submodules/majiang/image/dice.plist" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="dice1" ActionTag="1730522866" Tag="178" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="670.6400" RightMargin="509.3600" TopMargin="244.0000" BottomMargin="376.0000" ctype="SpriteObjectData">
                <Size X="100.0000" Y="100.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="720.6400" Y="426.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5630" Y="0.5917" />
                <PreSize X="0.0781" Y="0.1389" />
                <FileData Type="PlistSubImage" Path="dice_Action_3.png" Plist="submodules/majiang/image/dice.plist" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="lb_title" ActionTag="-1782992018" Tag="93" IconVisible="False" PositionPercentXEnabled="True" PercentWidthEnable="True" PercentWidthEnabled="True" LeftMargin="418.8800" RightMargin="418.8800" TopMargin="463.2128" BottomMargin="205.7232" IsCustomSize="True" FontSize="36" LabelText="请选择要吃的牌型" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="442.2400" Y="51.0640" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="231.2552" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.3212" />
                <PreSize X="0.3455" Y="0.0709" />
                <FontResource Type="Normal" Path="image/fonts/FZZY.TTF" Plist="" />
                <OutlineColor A="255" R="0" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="a0" ActionTag="182642582" VisibleForFrame="False" Tag="46" IconVisible="False" LeftMargin="567.0001" RightMargin="650.9999" TopMargin="367.5000" BottomMargin="263.5000" ctype="SpriteObjectData">
                <Size X="62.0000" Y="89.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="598.0001" Y="308.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4672" Y="0.4278" />
                <PreSize X="0.0484" Y="0.1236" />
                <FileData Type="PlistSubImage" Path="p2s26.png" Plist="submodules/majiang/image/pai.plist" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="a1" ActionTag="-1225885846" VisibleForFrame="False" Tag="47" IconVisible="False" LeftMargin="656.0003" RightMargin="561.9997" TopMargin="367.5001" BottomMargin="263.4999" ctype="SpriteObjectData">
                <Size X="62.0000" Y="89.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="687.0003" Y="307.9999" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5367" Y="0.4278" />
                <PreSize X="0.0484" Y="0.1236" />
                <FileData Type="PlistSubImage" Path="p2s26.png" Plist="submodules/majiang/image/pai.plist" />
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
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>