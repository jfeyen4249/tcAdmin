function printLabel(labelText) {
    var labelXml = `<?xml version="1.0" encoding="utf-8"?>
    <DesktopLabel Version="1">
      <DYMOLabel Version="3">
        <Description>DYMO Label</Description>
        <Orientation>Landscape</Orientation>
        <LabelName>Small30336</LabelName>
        <InitialLength>0</InitialLength>
        <BorderStyle>SolidLine</BorderStyle>
        <DYMORect>
          <DYMOPoint>
            <X>0.09</X>
            <Y>0.05666666</Y>
          </DYMOPoint>
          <Size>
            <Width>1.976667</Width>
            <Height>0.9033334</Height>
          </Size>
        </DYMORect>
        <BorderColor>
          <SolidColorBrush>
            <Color A="1" R="0" G="0" B="0"></Color>
          </SolidColorBrush>
        </BorderColor>
        <BorderThickness>1</BorderThickness>
        <Show_Border>False</Show_Border>
        <DynamicLayoutManager>
          <RotationBehavior>ClearObjects</RotationBehavior>
          <LabelObjects>
            <TextObject>
              <Name>TextObject0</Name>
              <Brushes>
                <BackgroundBrush>
                  <SolidColorBrush>
                    <Color A="0" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </BackgroundBrush>
                <BorderBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </BorderBrush>
                <StrokeBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </StrokeBrush>
                <FillBrush>
                  <SolidColorBrush>
                    <Color A="0" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </FillBrush>
              </Brushes>
              <Rotation>Rotation0</Rotation>
              <OutlineThickness>1</OutlineThickness>
              <IsOutlined>False</IsOutlined>
              <BorderStyle>SolidLine</BorderStyle>
              <Margin>
                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
              </Margin>
              <HorizontalAlignment>Center</HorizontalAlignment>
              <VerticalAlignment>Middle</VerticalAlignment>
              <FitMode>AlwaysFit</FitMode>
              <IsVertical>False</IsVertical>
              <FormattedText>
                <FitMode>AlwaysFit</FitMode>
                <HorizontalAlignment>Center</HorizontalAlignment>
                <VerticalAlignment>Middle</VerticalAlignment>
                <IsVertical>False</IsVertical>
                <LineTextSpan>
                  <TextSpan>
                    <Text>${labelText}</Text>
                    <FontInfo>
                      <FontName>Arial Black</FontName>
                      <FontSize>33.1</FontSize>
                      <IsBold>False</IsBold>
                      <IsItalic>False</IsItalic>
                      <IsUnderline>False</IsUnderline>
                      <FontBrush>
                        <SolidColorBrush>
                          <Color A="1" R="0" G="0" B="0"></Color>
                        </SolidColorBrush>
                      </FontBrush>
                    </FontInfo>
                  </TextSpan>
                </LineTextSpan>
              </FormattedText>
              <ObjectLayout>
                <DYMOPoint>
                  <X>0.1017623</X>
                  <Y>0.1729702</Y>
                </DYMOPoint>
                <Size>
                  <Width>1.926475</Width>
                  <Height>0.6540596</Height>
                </Size>
              </ObjectLayout>
            </TextObject>
          </LabelObjects>
        </DynamicLayoutManager>
      </DYMOLabel>
      <LabelApplication>Blank</LabelApplication>
      <DataTable>
        <Columns></Columns>
        <Rows></Rows>
      </DataTable>
    </DesktopLabel>`;

    var printerName = "DYMO LabelWriter 550"; // Change this to match your printer name

    try {
        var label = dymo.label.framework.openLabelXml(labelXml);
        if (label) {
            label.print(printerName);
        } else {
            alert("Failed to open label.");
        }
    } catch (e) {
        alert("Error printing label: " + e.message);
    }
}