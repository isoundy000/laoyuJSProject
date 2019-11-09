<GameFile>
  <PropertyGroup Name="ClubTimeHelpLayer" Type="Layer" ID="af63969f-f052-4b16-adbd-a65f127466e4" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="80" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="Sprite_1" ActionTag="1635427514" Tag="81" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="9.0000" RightMargin="9.0000" TopMargin="9.0000" BottomMargin="9.0000" ctype="SpriteObjectData">
            <Size X="1262.0000" Y="702.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="0.9859" Y="0.9750" />
            <FileData Type="Normal" Path="submodules/club/img/club_msg_bg.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="Sprite_3" ActionTag="-1437303088" Tag="85" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="576.5000" RightMargin="576.5000" TopMargin="14.4204" BottomMargin="631.5796" ctype="SpriteObjectData">
            <Size X="127.0000" Y="74.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="668.5796" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.9286" />
            <PreSize X="0.0992" Y="0.1028" />
            <FileData Type="Normal" Path="submodules/club/ClubTimeHelp/cshuoming.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="Panel_1" ActionTag="-556648109" Tag="83" IconVisible="False" TouchEnable="True" ClipAble="False" BackColorAlpha="0" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <Children>
              <AbstractNodeData Name="Text_1" Visible="False" ActionTag="-2128156981" Tag="84" IconVisible="False" LeftMargin="97.3691" RightMargin="182.6309" TopMargin="126.8745" BottomMargin="93.1255" IsCustomSize="True" FontSize="26" LabelText="营业时间，按钮关闭的时候，亲友圈全天开放。&#xA;营业时间，按钮打开的时候，亲友圈只在营业时间段内开放。&#xA;&#xA;营业时间设置好，并且打开后，将会在每天生效，直到下次手动关闭。&#xA;亲友圈的营业时间是针对一个亲友圈生效的，不只针对单个玩法&#xA;&#xA;开业时间，是指亲友圈的开放时间。在开放时间后，亲友圈成员可以进行游戏。&#xA;&#xA;打烊时间，是指亲友圈的关闭时间。在打烊时间后，亲友圈成员就不能在亲友圈中进行游戏。&#xA;开业时间，到打烊时间的设定，可以进行跨天的设置。&#xA;如，开业时间设定为09:00，打烊时间设定为02:00。就是为早晨9点开业，到第二天凌晨2点打烊。&#xA;如，开业时间设定为09:00，打烊时间设定为16:00。就是为早晨9点开业，到当天下午4点打烊。&#xA;请注意开业时间和打烊时间设置的区间限制。" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="1000.0000" Y="500.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="597.3691" Y="343.1255" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="92" G="122" B="146" />
                <PrePosition X="0.4667" Y="0.4766" />
                <PreSize X="0.7813" Y="0.6944" />
                <FontResource Type="Normal" Path="image/fonts/FZZY.TTF" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_2" Visible="False" ActionTag="1108762097" Tag="1027" IconVisible="False" LeftMargin="72.9526" RightMargin="57.0474" TopMargin="119.6702" BottomMargin="50.3298" IsCustomSize="True" FontSize="26" LabelText="(1)自定义榜设置时间范围：支持近7日内时间设置； &#xA;(2)时间设定：&#xA;   开始时间：“日”值最小值取当前日期时间，最大时间取值当前日+7；“时”值最小取值为&quot;当前整点后一小时&quot;&#xA;   结束时间：“日”值最小值取当前日期时间，最大时间取值当前日+7；&#xA;(3)示例：&#xA;   &lt;1&gt; 如当前时间：2018-11-02 17:04:00&#xA;       支持设置时间范围：2018-11-02 18:00:00至 2018-11-09 18:00:00&#xA;       开始时间“日”值可选：02…09&#xA;       开始时间“时”值可选：00…23&#xA;       结束时间“日”值可选：02…09&#xA;   &lt;2&gt;如当前时间：2018-11-25 17:04:00&#xA;      支持设置时间范围：2018-11-25 18:00:00至 2018-12-02 18:00:00&#xA;      开始时间“日”值可选：25…02&#xA;      开始时间“时”值可选：00…23&#xA;      结束时间“日”值可选：25…02" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="1150.0000" Y="550.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="1.0000" />
                <Position X="647.9526" Y="600.3298" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="92" G="122" B="146" />
                <PrePosition X="0.5062" Y="0.8338" />
                <PreSize X="0.8984" Y="0.7639" />
                <FontResource Type="Normal" Path="image/fonts/FZZY.TTF" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_3" Visible="False" ActionTag="-164850995" Tag="1028" IconVisible="False" LeftMargin="68.9583" RightMargin="61.0417" TopMargin="117.9753" BottomMargin="52.0247" IsCustomSize="True" FontSize="28" LabelText="1.功能说明&#xA;   1.1自由玩法功能支持玩家在亲友圈里面自由创建任何玩法；&#xA;   1.2自由玩法创建房间将消耗群主房卡。&#xA;2.功能设置&#xA;   2.1该功能只能由群主进行管理；&#xA;   2.2开启该功能将直接替换掉原来的第五个玩法，请群主自行设置处理。&#xA;3.牌桌&#xA;   3.1自由玩法楼层可以显示所有楼层的已开房间。" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="1150.0000" Y="550.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="1.0000" />
                <Position X="643.9583" Y="602.0247" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="92" G="122" B="146" />
                <PrePosition X="0.5031" Y="0.8361" />
                <PreSize X="0.8984" Y="0.7639" />
                <FontResource Type="Normal" Path="image/fonts/FZZY.TTF" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_4" Visible="False" ActionTag="823515614" Tag="205" IconVisible="False" LeftMargin="75.5050" RightMargin="54.4950" TopMargin="110.7095" BottomMargin="29.2905" IsCustomSize="True" FontSize="28" LabelText="1.名词解释&#xA;  1.1 发起合并的亲友圈：亲友圈A；&#xA;  1.2 要合入的亲友圈：亲友圈B；&#xA;  1.3 完成合群：亲友圈A合入亲友圈B。&#xA;2.功能说明&#xA;  2.1 合并亲友圈只有创建者可以进行合并，操作入口在【设置-合并亲友圈】；&#xA;  2.2 合并亲友圈仅用于两个亲友圈合并，但可以进行多次合并操作；&#xA;  2.3 完成合群后，群主可以在【管理-成员管理-成员分配】中进行成员分配，可替换公众号亲友圈的合并亲友圈（合群）绑定成员功能。 &#xA;3.角色变化&#xA;  3.1 亲友圈A的创建者将变为亲友圈B的管理员；&#xA;  3.2 亲友圈A的管理员将变为亲友圈B的普通成员；&#xA;  3.3 亲友圈A的全部成员在亲友圈B中默认分配给亲友圈A的原创建者（亲友圈B的管理员）名下。&#xA;4.其他&#xA;  4.1 亲友圈A不消失，您可以手动将其解散或继续使用； &#xA;  4.2 合并后亲友圈的新进成员，在未分配列表展示；&#xA;  4.3 重复亲友圈成员，默认放在合并之前亲友圈B的原来位置。" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="1150.0000" Y="580.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="1.0000" />
                <Position X="650.5050" Y="609.2905" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="92" G="122" B="146" />
                <PrePosition X="0.5082" Y="0.8462" />
                <PreSize X="0.8984" Y="0.8056" />
                <FontResource Type="Normal" Path="image/fonts/FZZY.TTF" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_5" Visible="False" ActionTag="-372217689" Tag="206" IconVisible="False" LeftMargin="88.9583" RightMargin="41.0417" TopMargin="137.9753" BottomMargin="32.0247" IsCustomSize="True" FontSize="28" LabelText="（1）全部成员：选中全部成员，展示群中成员信息&#xA;（2）我的成员：选中我的成员，展示群主绑定的成员信息&#xA;（3）管理员：选中管理员，数据展示管理员名下分配的成员信息&#xA;（4）2人场，3人场，4人场：统计玩家的参与场次  &#xA;     如：某玩家参与2人场1场，3人3场，4人4场                              &#xA;     则有效参与系数计算:如 1/2 + 3*（1/3）+4*（1/4）= 2.5" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="1150.0000" Y="550.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="1.0000" />
                <Position X="663.9583" Y="582.0247" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="92" G="122" B="146" />
                <PrePosition X="0.5187" Y="0.8084" />
                <PreSize X="0.8984" Y="0.7639" />
                <FontResource Type="Normal" Path="image/fonts/FZZY.TTF" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
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
          <AbstractNodeData Name="btn_close" ActionTag="-779308778" Tag="82" IconVisible="False" LeftMargin="1125.7030" RightMargin="68.2970" TopMargin="4.6773" BottomMargin="631.3227" ctype="SpriteObjectData">
            <Size X="86.0000" Y="84.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1168.7030" Y="673.3227" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9130" Y="0.9352" />
            <PreSize X="0.0672" Y="0.1167" />
            <FileData Type="Normal" Path="submodules/club/img/btn_close2.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>