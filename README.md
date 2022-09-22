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
- Escolher imagem 
- Importar/Exportar anotações
- Outras formas: Elipse, Círculo, Ponto?
- Barra de ferramentas
- Selecionar vários elementos com shift
- Duplicar, Ctrl+c Ctrl+v
- Anotações por imagem
- Exibir cursor correto de acordo com ação
- Impedir que desenhe fora da área da imagem
- Informações que auxiliam utilização ao passar o mouse por cima
- Barra de rolagem na tela
- Mensagens de status da ação
- Possibilitar campos de texto em cada formato
- Categorias com cores
- Hierarquia/Lista dos elementos criados

NÃO Mover Seleção pixel a pixel com setas
OK Previnir formatos com área 0 ou próxima disso
OK Corrigir edição de retângulo para ser mais intuitivo