# Mapa Interativo de Casos e Mortes COVID-19

## Por que fiz essas escolhas de design?

Quando comecei a trabalhar nessa visualização, minha principal preocupação era criar uma maneira fácil e intuitiva para qualquer pessoa explorar os dados globais da pandemia. Eu queria que fosse simples de navegar, mas ainda assim interessante. Vou explicar um pouco sobre o que pensei em algumas escolhas de design.

### Codificação Visual

1. **Cores**:

   - Escolhi uma paleta de cores sequenciais **YlOrRd** do D3.js para mostrar a intensidade dos casos e mortes. As cores mais claras (amarelo) indicam menos casos/mortes, enquanto as mais escuras (vermelho) representam os países mais afetados. Isso me ajudou a criar uma visualização que permite ver rapidamente onde os impactos da pandemia foram mais severos.

2. **Mapa**:

   - Usei a projeção **Mercator** porque ela é bem conhecida e é a mais comum para esse tipo de visualização global. Ela ajuda a mapear os países de forma precisa e clara.
   - Adicionei um efeito de **mouseover** no mapa, para que o usuário possa ver detalhes de cada país quando passar o mouse sobre ele. Isso traz um toque interativo e evita sobrecarregar a tela com informações excessivas.

3. **Slider de Tempo**:
   - Escolhi um slider horizontal para que o usuário possa explorar como os dados evoluíram ao longo do tempo. O objetivo era oferecer uma interação simples, mas que permitisse um controle direto e prático dos dados.

### Interações e Animações

Uma das interações principais que pensei foi a alternância entre **casos** e **mortes** com o botão de toggle. Isso permite que o usuário explore os dados de maneira prática. Para dar um toque extra, incluí animações suaves no mapa, para que as transições entre diferentes países e dados aconteçam de maneira fluida.

### Alternativas Consideradas

No começo, pensei em usar gráficos de barras empilhadas, mas logo percebi que um mapa seria a escolha ideal para visualizar dados geograficamente. Também considerei gráficos de linha para mostrar a evolução ao longo do tempo, mas optei pelo slider, porque ele dá uma sensação de controle mais direta sobre os dados.

### Tempo de Desenvolvimento

- Ao todo, eu gastei cerca de **15 horas** no desenvolvimento. A maior parte do tempo foi dedicada à implementação do mapa e à integração dos dados usando o D3.js.
- O que mais demorou foi ajustar o comportamento do slider e garantir que os dados temporais estivessem bem representados. Também passei um bom tempo ajustando as animações para garantir que a navegação fosse fluida.

### O que levou mais tempo?

A parte mais difícil foi integrar os dados corretamente no mapa e fazer com que o slider funcionasse de forma perfeita com esses dados temporais. Além disso, as animações precisaram ser bem ajustadas para que tudo funcionasse.

## Fontes Utilizadas

### Dados

Os dados para essa visualização vêm de um conjunto do Kaggle, chamado **"COVID-19 Geographic Distribution Worldwide"**, que pode ser acessado [aqui](https://www.kaggle.com/datasets/cristiangarrido/covid19geographicdistributionworldwide?resource=download). Esses dados têm origem no **Epidemic Intelligence, National Weekly Data**.

### Inspiração

Me inspirei em algumas visualizações de COVID-19 disponíveis em outros sites, como as que estão no [D3 Gallery](https://observablehq.com/@d3/gallery). Além disso, um dos principais sites de referência foi o [Worldometers](https://www.worldometers.info/coronavirus/), que apresenta dados de forma clara e direta.
