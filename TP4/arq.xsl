<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>
    
    <xsl:template match="/">
        <xsl:result-document href="site/index.html">
            <html>
                <head>                    
                    <title>Arquiossítios do NW Português</title>
                </head>
                <body>
                    <h3>Índice de arqueossítios</h3>
                    <ul>
                        <xsl:apply-templates select="//ARQELEM[not(CONCEL=preceding::CONCEL)]">
                            <xsl:sort select="CONCEL"/>
                        </xsl:apply-templates>                            
                    </ul>    
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates select="//ARQELEM" mode="individual"></xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="ARQELEM">
        <xsl:variable name="c" select="CONCEL"/>
        <li>
            <xsl:value-of select="CONCEL"/>
            <ul>
                <xsl:apply-templates select="//ARQELEM[CONCEL=$c]" mode="subindice">
                    <xsl:sort select="normalize-space(IDENTI)"></xsl:sort>
                </xsl:apply-templates>
            </ul>
        </li>
    </xsl:template>
    
    <xsl:template match="ARQELEM" mode="subindice">
        <li>
            <a href="arq{count(preceding-sibling::*)+1}.html">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>
    
    <xsl:template match="ARQELEM" mode="individual">
        <xsl:result-document href="site/arq{count(preceding-sibling::*)+1}.html">
            <html>
                <head>
                    <title>
                        <xsl:value-of select="IDENTI"/>
                    </title>
                </head>
                <body>
                    <dl>                        
                        <xsl:for-each select="./*">
                            <dt style="color:magenta">
                                <xsl:value-of select="name(.)"/>
                            </dt>
                            <dd style="color:blue">
                                <xsl:value-of select="."/>
                            </dd>
                        </xsl:for-each>
                    </dl>
                    <address>
                        [
                        <a href="index.html">Voltar ao Índice</a>
                        ]
                    </address>
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
</xsl:stylesheet>