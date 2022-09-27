# APRENDENDO REACT

## Anotar Imagem

[https://kcire.fslab.dev/aprendendoreact/anotarimagem/](https://kcire.fslab.dev/aprendendoreact/anotarimagem/)

### Controles:
- Navegação
    Clique com botão direito + arraste para mover a tela
    Setas também movem a tela
    Scroll do mouse aumenta ou diminui o zoom, com centro no cursor do mouse

- Desenhar
    Pressione 1 para desenhar retângulos
    Pressione 2 para desenhar polígonos

    Clique e arraste o mouse para desenhar retângulos

    No caso de polígonos, clique uma vez para cada ponto que deseja inserir e finalize apertando enter, botão direito ou clicando no primeiro ponto

- Editar
    Clique em um formato que foi desenhado para selecioná-lo

    Uma vez selecionado, clique e arraste nos pontos para editar
    Em polígonos, se clicar em uma linha irá criar um novo ponto ali, e se clicar com o botão direito em um ponto irá remover este ponto

    com o formato selecionado, é possível também arrastar todos os pontos clicando e arrastando no meio

    Delete apaga o formato selecionado

    Ctrl+z apaga o último formato desenhado

    Esc cancela a operação em andamento

### Funcionalidades:
- Interação e Movimentação do Canvas
    - Zoom e pan com scroll do mouse
    - Botão direito para arrastar a tela
    - Arrastar a tela com as setas do teclado
    - Arrastar a tela para os lados quando sair com o mouse enquanto edita alguma coisa
    - Suporte a mobile/touchscreen
        - Emulação de mouse: Botão esquerdo 1 toque, direito 2 toques, meio 3 toques
        - Zoom com gesto
- Anotar Imagem
    - Desenhar formas:
        - Retângulo
        - Polígono
    - Editar formatos
        - Mover pontos individualmente
        - Adicionar/Remover pontos em polígonos
        - Redimensionar apenas largura ou apenas altura do retângulo pela aresta
        - Deletar elementos
        - Arrastar o elemento

### A fazer
- UI
  - Escolher imagem 
  - Barra de ferramentas
  - Hierarquia/Lista dos elementos criados
  - Mensagens de status da ação
  - Importar/Exportar anotações em json
  - Categorias e Atributos
- Várias Imagens
  - Anotações por imagem
- Edição
  - Outras formas: Elipse, Círculo, Ponto, Polyline (Polígono aberto), Spline, Segmentação
  - Selecionar vários elementos com shift
  - Duplicar, Ctrl+c Ctrl+v
  - Exibir cursor correto de acordo com ação
  - Informações que auxiliam utilização ao passar o mouse por cima
  - Possibilitar campos de texto em cada formato
  - Alinhar o movimento com os eixos X ou Y se segurar ALT
  - Ctrl+z infinito
  - Camadas, ver/esconder anotações baseado em alguma característica
- Navegação no Canvas
  - Barra de rolagem na tela
  - Impedir que desenhe fora da área da imagem

<hr>
Coisas que não serão feitas

- NÃO Mover Seleção pixel a pixel com setas, usar setas para mover câmera

## Outros anotadores

- VGG Image Annotator https://www.robots.ox.ac.uk/~vgg/software/via/

- Make Sense https://www.makesense.ai/
  - bounding box, point, line, polygon

- DLabel https://dlabel.org
  - bounding box, polygon, spline, graph (polyline?)
  - multiple users annotate the same frame

- Super Annotate https://app.superannotate.com
  - Bounding box, polygon, polyline, points, ellipse, cuboid
  
- FREE CVAT https://cvat.org
  - bounding box, polygon, polyline, points, cuboid

- Labelbox https://editor.labelbox.com
  - bounding box, polygon, polyline, points, segmentation

segmentation: selecionar área da imagem baseado em análise de contraste/cores/linhas (Tipo a varinha mágica do Paint.NET)