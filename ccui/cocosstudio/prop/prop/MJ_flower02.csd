<GameFile>
  <PropertyGroup Name="MJ_flower02" Type="Node" ID="284abdb7-776f-4f42-a331-f1b133635fac" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="20" Speed="1.0000">
        <Timeline ActionTag="803266442" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="20" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="803266442" Property="Scale">
          <ScaleFrame FrameIndex="20" X="1.0000" Y="1.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="803266442" Property="RotationSkew">
          <ScaleFrame FrameIndex="20" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="803266442" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="PlistSubImage" Path="MJ_flower_star11.png" Plist="prop/prop/MJ_flower.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="20" Tween="False">
            <TextureFile Type="PlistSubImage" Path="MJ_flower_star11.png" Plist="prop/prop/MJ_flower.plist" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="803266442" Property="VisibleForFrame">
          <BoolFrame FrameIndex="20" Tween="False" Value="True" />
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="action" StartIndex="0" EndIndex="20">
          <RenderColor A="255" R="0" G="0" B="128" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="33" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="Node_1" ActionTag="-111654146" Tag="35" IconVisible="True" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <Children>
              <AbstractNodeData Name="Sprite_2" ActionTag="803266442" Tag="36" IconVisible="False" LeftMargin="-68.5000" RightMargin="-68.5000" TopMargin="-62.5000" BottomMargin="-62.5000" ctype="SpriteObjectData">
                <Size X="137.0000" Y="125.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="PlistSubImage" Path="MJ_flower_star11.png" Plist="prop/prop/MJ_flower.plist" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position />
            <Scale ScaleX="0.8000" ScaleY="0.8000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>