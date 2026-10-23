import {
  Building2,
  CalendarCheck,
  CalendarDays,
  Compass,
  Eye,
  Globe,
  Inbox,
  Keyboard,
  KeyRound,
  Settings,
  Sparkles,
  Tag,
  Upload,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";

import {
  DocFigure,
  DocH3,
  DocList,
  DocP,
  DocPill,
  DocSection,
  DocStep,
  DocSteps,
  DocTerms,
  DocTip,
  Kbd,
} from "@/components/docs/docs-parts";

import type { DocEntry } from "./types";

function Basics() {
  return (
    <DocSection
      id="primeros-pasos"
      icon={Compass}
      title="Primeiros passos"
      intro="A Tivvo reúne num só lugar os pedidos que recebe, os seus clientes, a sua carteira de imóveis, as propostas que envia, as reservas e a disponibilidade. Tudo o que publica aparece no site da sua agência."
    >
      <DocFigure
        src="/docs-media/pt/panel.webp"
        alt="O painel da Tivvo com o menu lateral, a lista de imóveis e o cartão de perfil"
        width={1584}
        height={946}
        markers={[
          { x: 8.9, y: 11.6, label: "O menu lateral: cada ferramenta do painel." },
          { x: 15.5, y: 4.7, label: "Recolher ou expandir o menu (Ctrl/⌘ + B)." },
          { x: 15.1, y: 11.6, label: "Quantos pedidos tem por ler." },
          { x: 33.1, y: 6, label: "A barra da lista: pesquisa, ordem, filtros, vistas, lixo e importar." },
          { x: 88, y: 6, label: "Criar um novo." },
          { x: 14.7, y: 94.7, label: "O sino das notificações." },
          { x: 8.8, y: 93.7, label: "O seu cartão de perfil: a sua conta, a aparência, a ajuda e esta documentação." },
        ]}
      />

      <DocH3>O menu lateral</DocH3>
      <DocP>
        As ferramentas estão pela ordem em que uma agência trabalha: chega um <strong>pedido</strong>, torna-se{" "}
        <strong>cliente</strong>, oferece-lhe <strong>imóveis</strong> numa <strong>oferta</strong> e termina numa{" "}
        <strong>reserva</strong>. Depois vêm <strong>Disponibilidade</strong> e <strong>Serviços</strong>. Se for titular
        ou administrador da conta, no fim vê também <strong>Site</strong>, <strong>Equipa</strong> e{" "}
        <strong>Definições</strong>.
      </DocP>
      <DocP>
        «Pedidos» mostra um número quando tem pedidos por ler; atualiza-se sozinho a cada minuto. Pode recolher o menu com
        o botão de cima ou com <Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd> para ganhar espaço, e a Tivvo lembra-se de como o deixou. No
        telemóvel, o menu abre-se a partir do ícone de cima.
      </DocP>

      <DocH3>Notificações</DocH3>
      <DocP>
        O sino, ao lado do seu nome, avisa-o do que aconteceu enquanto não estava a olhar: um pedido novo, um cliente que
        abriu uma oferta ou lhe respondeu a partir dela, um pagamento registado, uma reserva e as tarefas que lhe
        atribuíram. O número indica quantos avisos não leu; atualiza-se a cada minuto.
      </DocP>
      <DocFigure
        src="/docs-media/pt/notificaciones.webp"
        alt="A lista de notificações com pedidos novos e uma oferta aberta"
        width={760}
        height={982}
        className="max-w-sm"
        markers={[
          { x: 77.4, y: 8.1, label: "«Marcar todas» deixa-as como lidas." },
          { x: 50, y: 23.2, label: "Cada aviso leva-o ao que aconteceu (o pedido, a oferta, a reserva). O ponto indica que não o leu." },
        ]}
      />
      <DocP>
        Para eliminar um aviso, passe o rato por cima e toque na cruz à direita (no telemóvel, a cruz vê-se sempre).
        Apaga-se só para si: o resto da equipa continua a ver o seu, e não se pode recuperar.
      </DocP>

      <DocH3>O seu cartão de perfil</DocH3>
      <DocP>
        Por baixo do menu está o seu nome. Ao tocar nele abre-se o menu da sua conta: o seu perfil, as definições, mudar de
        agência (se trabalhar em mais de uma), ver ou copiar o link do seu site, a aparência, o idioma, esta documentação,
        a pesquisa, os atalhos de teclado, a ajuda e terminar sessão.
      </DocP>
      <DocFigure
        src="/docs-media/pt/menu-perfil.webp"
        alt="O menu da conta aberto a partir do cartão de perfil"
        width={640}
        height={1252}
        className="max-w-xs"
        markers={[
          { x: 50, y: 28.5, label: "O meu perfil: os seus dados e a sua palavra-passe." },
          { x: 50, y: 34.2, label: "Definições da agência (titulares e administradores)." },
          { x: 50, y: 41.4, label: "Abrir ou copiar o link do seu site." },
          { x: 75, y: 55.3, label: "Aparência: clara, escura ou automática (segue o seu computador)." },
          { x: 50, y: 69.2, label: "Esta documentação, noutro separador." },
          { x: 50, y: 74.9, label: "A pesquisa e, por baixo, os atalhos de teclado." },
          { x: 50, y: 86.4, label: "Ajuda e suporte: perguntas frequentes e contacto com a Tivvo." },
          { x: 50, y: 93.6, label: "Terminar sessão." },
        ]}
      />
      <DocTip>
        Se trabalhar para mais de uma agência, «Mudar de agência» aparece neste menu. Cada agência tem os seus próprios
        dados: ao mudar, o painel recarrega com os da outra.
      </DocTip>

      <DocH3>Funções</DocH3>
      <DocTerms
        items={[
          ["Titular", "O dono da conta. Tem acesso a tudo e não pode ser retirado da equipa."],
          [
            "Administrador",
            "Como o titular: vê tudo, gere a equipa, o site, as definições e a importação, e reatribui imóveis e clientes.",
          ],
          [
            "Agente",
            "Vê só os imóveis que lhe estão atribuídos, as suas ofertas e reservas, os seus clientes e os leads sem responsável. Não vê Site, Equipa, Definições, Importar nem o extrato de conta dos proprietários.",
          ],
        ]}
      />

      <DocH3>Coisas que se repetem em todo o painel</DocH3>
      <DocTerms
        items={[
          [
            "Barra de ações",
            "Nos editores aparece em cima uma barra com Guardar, Publicar e Cancelar. Quando há algo por guardar, o botão Guardar ativa-se. Ctrl/⌘ + S guarda sem tocar no rato.",
          ],
          [
            "Vistas",
            "As listas podem ver-se em grelha, lista ou tabela (teclas 1, 2 e 3). A Tivvo lembra-se da vista que escolheu em cada navegador.",
          ],
          [
            "Pesquisa e filtros",
            "Cada lista tem uma pesquisa e filtros para limitar o que vê. Cada filtro mostra quantos elementos há em cada opção. «Retirar filtros» volta a mostrar tudo.",
          ],
          [
            "Lixo",
            "O que apaga de Imóveis, Ofertas e Reservas vai para o lixo, não desaparece. Fica lá 30 dias caso se arrependa; depois é apagado definitivamente. Ao apagar, o aviso em baixo tem «Anular».",
          ],
          [
            "«Mostra-se no site» / «Só interno»",
            "Cada bloco de um formulário diz-lhe se o que regista é visto pelos seus clientes ou fica só para a sua equipa.",
          ],
          [
            "Ajuda",
            "O botão com o ponto de interrogação, em cada ferramenta, abre a parte deste guia que fala dela.",
          ],
        ]}
      />

      <DocH3>O lixo</DocH3>
      <DocP>
        Abre-se a partir do ícone do caixote, na barra de Imóveis, Ofertas e Reservas. Um número sobre o ícone indica
        quantas coisas há lá dentro.
      </DocP>
      <DocFigure
        src="/docs-media/pt/papelera.webp"
        alt="O lixo de imóveis com um imóvel apagado"
        width={1304}
        height={281}
        markers={[
          { x: 36.9, y: 87.1, label: "Quando o apagou e quantos dias lhe restam." },
          { x: 71, y: 82, label: "«Restaurar» devolve-o à sua lista, tal como estava." },
          { x: 85.5, y: 82, label: "«Apagar definitivamente» elimina-o já, sem esperar os 30 dias. Pedimos confirmação." },
        ]}
      />
    </DocSection>
  );
}

function Inquiries() {
  return (
    <DocSection
      id="consultas"
      icon={Inbox}
      title="Pedidos"
      intro="A caixa de entrada de tudo o que lhe escrevem a partir do seu site, da ficha de um imóvel ou de uma oferta."
    >
      <DocFigure
        src="/docs-media/pt/consultas.webp"
        alt="A caixa de pedidos com um pedido aberto"
        width={1304}
        height={946}
        markers={[
          { x: 20.7, y: 7.4, label: "Todos ou só os novos, com quantos há por ler." },
          { x: 29, y: 7.4, label: "Marcar todos como lidos." },
          { x: 18.9, y: 13.5, label: "Pesquise por nome, email, mensagem, imóvel ou oferta." },
          { x: 54.4, y: 21.7, label: "Sobre o que perguntou: o imóvel, a oferta ou um pedido geral." },
          { x: 92.4, y: 8.6, label: "Voltar a marcá-lo como novo para não o esquecer." },
          { x: 47.7, y: 87.4, label: "Responder por email, WhatsApp ou ligar; ou ir à ficha do cliente." },
        ]}
      />

      <DocH3>O que acontece quando chega um</DocH3>
      <DocList>
        <li>Aparece em Pedidos como novo e soma ao número do menu lateral e ao sino.</li>
        <li>
          Cria-se o cliente, ou atualiza-se se já existia um com esse email. No seu histórico fica uma nota que nomeia o
          imóvel ou a oferta sobre que perguntou.
        </li>
        <li>
          A agência recebe um aviso por email (no email de contacto das Definições ou, se não houver, os titulares e
          administradores) e o cliente recebe uma confirmação.
        </li>
      </DocList>

      <DocH3>Trabalhar a caixa</DocH3>
      <DocList>
        <li>
          À esquerda está a lista, agrupada em Hoje, Ontem, Esta semana e Anteriores; à direita, o pedido aberto. No
          telemóvel alternam: toque num para o ler e na seta para voltar.
        </li>
        <li>Ao abrir um pedido, fica marcado como lido. O envelope em cima à direita volta a marcá-lo como novo.</li>
        <li>Os de um cliente que já tem mostram a sua etapa (Lead, Contactado…) ao lado do nome.</li>
        <li>
          Responda com um clique: <strong>Responder por email</strong> (com o assunto e a saudação já escritos),{" "}
          <strong>WhatsApp</strong> (com uma mensagem que nomeia o que perguntou) ou <strong>Ligar</strong>. WhatsApp e
          Ligar aparecem se deixou telefone. O ícone ao lado do email copia-o.
        </li>
        <li>Toque no imóvel ou na oferta para o abrir no painel, ou em «Ver cliente» para ir à sua ficha.</li>
        <li>A caixa atualiza-se sozinha a cada minuto.</li>
      </DocList>
      <DocTip>
        Se ainda não chegou nenhum pedido, partilhe o link do seu site: o formulário de contacto e o de cada ficha chegam
        aqui.
      </DocTip>
    </DocSection>
  );
}

function Clients() {
  return (
    <DocSection
      id="clientes"
      icon={Users}
      title="Clientes"
      intro="A sua agenda de contactos e o seu acompanhamento: em que etapa está cada um, o que procura, o que há a fazer com ele e cada vez que falaram."
    >
      <DocFigure
        src="/docs-media/pt/clientes-lista.webp"
        alt="A lista de clientes em grelha"
        width={1304}
        height={946}
        markers={[
          { x: 26.3, y: 6, label: "Pesquise por nome, email ou telefone." },
          { x: 65, y: 6, label: "Filtre por etapa." },
          { x: 89.7, y: 6, label: "Registar um cliente manualmente." },
          { x: 77.4, y: 87.8, label: "A etapa de cada cliente." },
          { x: 41.8, y: 73.3, label: "De onde chegou: site, oferta ou registo manual; e há quanto tempo foi o último movimento." },
        ]}
      />

      <DocH3>Como chegam</DocH3>
      <DocList>
        <li>
          <strong>Registo manual:</strong> «Novo cliente» com nome, email e telefone.
        </li>
        <li>
          <strong>A partir do site ou de uma oferta:</strong> quando alguém lhe escreve, a Tivvo cria o cliente (ou
          reconhece-o pelo email) e deixa uma nota no seu histórico com o imóvel ou a oferta sobre que perguntou.
        </li>
      </DocList>

      <DocH3>Etapas</DocH3>
      <DocTerms
        items={[
          [<DocPill key="l" tone="amber">Lead</DocPill>, "Acabou de chegar; ainda não falou com ele."],
          [<DocPill key="c" tone="primary">Contactado</DocPill>, "Já houve um primeiro contacto."],
          [<DocPill key="n">Em negociação</DocPill>, "Estão a conversar sobre uma proposta concreta."],
          [<DocPill key="k" tone="primary">Cliente</DocPill>, "Fechou uma operação consigo."],
          [<DocPill key="p">Perdido</DocPill>, "Não avançou. Vê-se mais esbatido na lista."],
        ]}
      />
      <DocP>
        Mude a etapa a partir do menu <strong>⋯</strong> de cada cliente («Mudar etapa») ou a partir da sua ficha. Nesse
        mesmo menu pode ver a ficha, enviar-lhe um email, ligar-lhe ou copiar o email.
      </DocP>

      <DocH3>A ficha do cliente</DocH3>
      <DocFigure
        src="/docs-media/pt/clientes-ficha.webp"
        alt="A ficha de um cliente com notas, tarefas e histórico"
        width={1304}
        height={1651}
        markers={[
          { x: 4.6, y: 15.8, label: "Notas: o que convém lembrar." },
          { x: 5, y: 34.3, label: "Tarefas com data limite; as vencidas, a vermelho." },
          { x: 5.9, y: 58.2, label: "Histórico: notas, chamadas, emails e reuniões." },
          { x: 82.4, y: 14.1, label: "Mudar a etapa." },
          { x: 82.4, y: 20.1, label: "O agente responsável." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Notas",
            "O que convém lembrar: o que procura, orçamento, preferências. Admite títulos, negrito, listas e links. Quando altera algo aparece «Guardar notas».",
          ],
          [
            "Tarefas",
            "O que há a fazer com este cliente: ligar, enviar fotos, combinar uma visita. Escreva a tarefa, escolha uma data limite opcional e toque em +. Marque a caixa quando a fizer. As vencidas veem-se a vermelho («Venceu há 2 dias»), e as de hoje e amanhã dizem-no.",
          ],
          [
            "Histórico",
            "Escolha o tipo (nota, chamada, email ou reunião), escreva o que aconteceu e toque em «Registar». Ordena-se do mais recente para o mais antigo e mostra quem o registou.",
          ],
          ["Etapa", "Toque na nova etapa no painel da direita; guarda-se no momento."],
          [
            "Responsável",
            "O agente que acompanha o cliente. Titulares e administradores escolhem-no da lista da equipa; um agente pode tocar em «Ficar com ele» num lead sem responsável.",
          ],
          ["Contacto", "O seu email e telefone, a um toque de lhe escrever ou ligar."],
        ]}
      />
      <DocTip>
        Ao eliminar uma tarefa não há lixo: desaparece no momento. Se apenas a terminou, é melhor marcá-la como feita.
      </DocTip>
    </DocSection>
  );
}

function Properties() {
  return (
    <DocSection
      id="propiedades"
      icon={Building2}
      title="Imóveis"
      intro="A sua carteira: cada casa, apartamento, terreno ou alojamento de temporada que comercializa, com todos os seus dados, fotos, preços e disponibilidade."
    >
      <DocH3>Registar um imóvel</DocH3>
      <DocSteps>
        <DocStep>
          Toque em <strong>Novo imóvel</strong> (ou na tecla <Kbd>N</Kbd> na lista).
        </DocStep>
        <DocStep>
          Escolha o que vai fazer com ele: <strong>Venda</strong> ou <strong>Arrendamento</strong>. Isto muda as
          categorias disponíveis e as secções do editor.
        </DocStep>
        <DocStep>Escreva um título e escolha a categoria (moradia, apartamento, villa, hotel, terreno…).</DocStep>
        <DocStep>
          Toque em <strong>Criar imóvel</strong>. É criado como <DocPill tone="amber">Rascunho</DocPill> e abre-se o
          editor para completar o resto.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/pt/propiedades-nueva.webp"
        alt="O diálogo Novo imóvel"
        width={784}
        height={968}
        className="max-w-md"
        markers={[
          { x: 72.7, y: 29.3, label: "Venda ou arrendamento." },
          { x: 50, y: 47.2, label: "O título com que os seus clientes o veem." },
          { x: 50, y: 55.5, label: "A categoria; muda consoante seja venda ou arrendamento." },
          { x: 82, y: 92.4, label: "Cria o imóvel e abre o editor." },
        ]}
      />
      <DocTip>
        Tem os seus imóveis noutro sistema? Use <strong>Importar</strong> para os trazer todos de uma vez. Ver «Importar
        imóveis» mais abaixo.
      </DocTip>

      <DocH3>Estados</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Rascunho</DocPill>, "Só a sua equipa o vê. Ideal enquanto o vai completando."],
          [<DocPill key="p" tone="primary">Publicado</DocPill>, "Aparece no seu site e pode ser juntado a ofertas."],
          [<DocPill key="a">Arquivado</DocPill>, "Já não está no mercado, mas conserva todos os seus dados. Pode voltar a ser publicado."],
        ]}
      />

      <DocH3>A lista</DocH3>
      <DocFigure
        src="/docs-media/pt/propiedades-lista.webp"
        alt="A lista de imóveis em vista de grelha"
        width={1276}
        height={946}
        markers={[
          { x: 16.9, y: 6, label: "Pesquisa por título, zona, região, país ou proprietário." },
          { x: 41.2, y: 6, label: "Ordem: mais recentes, mais antigos, preço ou título." },
          { x: 50.2, y: 6, label: "Filtros (tecla F)." },
          { x: 57.6, y: 6, label: "Vista de tabela, lista ou grelha." },
          { x: 65, y: 6, label: "Lixo: o que foi apagado nos últimos 30 dias." },
          { x: 72.8, y: 6, label: "Importar imóveis de outro sistema (titulares e administradores)." },
          { x: 85.1, y: 6, label: "Novo imóvel (tecla N)." },
          { x: 37.6, y: 69.3, label: "O estado de cada imóvel." },
        ]}
      />
      <DocList>
        <li>
          Cada cartão mostra a foto de capa, a operação e a categoria, a localização, o preço, quartos, casas de banho,
          área, o proprietário e há quanto tempo foi atualizado.
        </li>
        <li>Mostram-se 25 por página. Ao descer, a pesquisa fica a flutuar em cima para não ter de voltar.</li>
        <li>
          A partir do menu <strong>⋯</strong> de cada imóvel: editar, vê-lo no site (se estiver publicado), publicar,
          despublicar, arquivar, voltar a publicar ou eliminar. O ícone da seta também abre a ficha pública.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/pt/propiedades-filtros.webp"
        alt="O painel de filtros de imóveis"
        width={560}
        height={1604}
        className="max-w-xs"
        markers={[
          { x: 50.1, y: 3.8, label: "Estado, tipo e categoria: pode marcar mais de um; sem marcar, veem-se todos." },
          { x: 50.1, y: 36.5, label: "Localização e proprietário." },
          { x: 27.5, y: 57.3, label: "Intervalo de preço, na moeda que escolher." },
          { x: 50.1, y: 62.2, label: "Mínimo de quartos e casas de banho." },
          { x: 16.9, y: 96, label: "Limpar repõe tudo a zero." },
          { x: 62.1, y: 96, label: "Aplica os filtros e diz-lhe quantos imóveis restam." },
        ]}
      />
      <DocP>Os filtros ativos aparecem como etiquetas em cima da lista; toque na cruz de uma para a retirar.</DocP>

      <DocH3>Ações em lote</DocH3>
      <DocP>
        Na vista de tabela, marque vários imóveis com a caixa de cada linha (ou todos com a de cima). Em baixo aparece uma
        barra para os publicar, despublicar, arquivar ou eliminar juntos. <Kbd>Esc</Kbd> limpa a seleção.
      </DocP>
      <DocFigure
        src="/docs-media/pt/propiedades-lote.webp"
        alt="Dois imóveis selecionados e a barra de ações em lote"
        width={1276}
        height={946}
        markers={[
          { x: 2.2, y: 30, label: "Marque os imóveis." },
          { x: 47.9, y: 94.2, label: "A barra de ações em lote." },
        ]}
      />

      <DocH3>O editor</DocH3>
      <DocP>
        Em cima está a barra do editor, com as secções agrupadas: <strong>Informação geral</strong>,{" "}
        <strong>Multimédia</strong>, <strong>Arrendamento</strong> (só em arrendamentos), <strong>Gestão</strong> e{" "}
        <strong>Contacto</strong>. Passe o rato (ou toque) num grupo com seta para ver as suas secções. Guarde com{" "}
        <strong>Guardar</strong> ou <Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd>. <strong>Publicar</strong> guarda e publica num só
        passo; se já estiver publicado, o botão passa a ser <strong>Despublicar</strong>. Se tentar sair com alterações
        por guardar, avisamos.
      </DocP>
      <DocFigure
        src="/docs-media/pt/propiedades-editor.webp"
        alt="O editor de um imóvel na secção Básico"
        width={1760}
        height={990}
        markers={[
          { x: 21.6, y: 5.1, label: "Voltar à lista de imóveis." },
          { x: 31.1, y: 5.1, label: "As secções do editor, agrupadas." },
          { x: 85.4, y: 5.1, label: "Ajuda, Cancelar, Guardar e Publicar ou Despublicar." },
          { x: 39.7, y: 46.5, label: "O responsável: o agente que o acompanha." },
          { x: 85.8, y: 27.8, label: "Assim se vê o cartão na sua carteira, ao vivo enquanto edita." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Básico",
            "Título, nome privado (como a sua equipa lhe chama; o cliente nunca o vê), responsável, operação, categoria, quartos, casas de banho, áreas, lugares de garagem, arrecadações, pisos, ano de construção e de renovação, certificado energético. Em arrendamentos também hóspedes e estrelas.",
          ],
          [
            "Localização",
            "Como se mostra (a localização visível para os seus clientes), onde fica (o endereço exato e o pin no mapa, só internos), a envolvente (características da zona e vistas) e links (Google Maps, brochura em PDF e site).",
          ],
          [
            "Comodidades",
            "Comodidades gerais (a lista curta da ficha: escreva cada uma e Enter), comodidades interiores e exteriores, piscinas e jacuzzis com tipo e medidas, quartos por tipo, distribuição das divisões e serviços e condições.",
          ],
          [
            "Conteúdo e serviços",
            "O resumo (em destaque no topo da ficha) e a descrição, com títulos e listas. Em arrendamentos, também os serviços incluídos no preço e as políticas de reserva e cancelamento.",
          ],
          [
            "Preços",
            "Preço de venda ou preço base por noite, e moeda. Se o deixar vazio, a ficha mostra «Preço sob consulta».",
          ],
          ["Fotos", "Ver mais abaixo. As alterações desta secção guardam-se no momento, sem tocar em Guardar."],
          [
            "Essenciais",
            "Dados internos: quem administra o imóvel no dia a dia, o fornecedor e a licença, a comissão e se pode ser comercializado fora do seu site.",
          ],
          [
            "Recomendações",
            "Melhorias sugeridas com detalhe, custo estimado, prioridade e estado (proposta, aprovada ou feita). O proprietário vê-as na sua página.",
          ],
          ["Quartos", "Só em hotéis, dentro de Gestão: os quartos do hotel."],
          ["Proprietário", "O dono do imóvel, o seu link de acesso e o seu extrato de conta. Ver «Proprietários»."],
        ]}
      />
      <DocP>
        O <strong>responsável</strong> (em Básico) define que agente o vê: um agente só trabalha com os imóveis que lhe
        estão atribuídos. Escolhem-no titulares e administradores, e guarda-se ao escolher.
      </DocP>

      <DocH3>Localização</DocH3>
      <DocFigure
        src="/docs-media/pt/propiedades-ubicacion.webp"
        alt="A secção Localização com a localização visível, o endereço e o mapa"
        width={1452}
        height={1100}
        markers={[
          { x: 26.9, y: 14.1, label: "O que veem os seus clientes: a localização visível." },
          { x: 26.9, y: 40.2, label: "O endereço exato e o pin, só para a sua equipa." },
          { x: 80.5, y: 48.2, label: "Pesquise o endereço, clique no mapa ou arraste o pin." },
        ]}
      />
      <DocP>
        Para obter as coordenadas também pode colar um link do Google Maps. O endereço exato nunca se mostra no site: os
        seus clientes veem só a localização visível (por exemplo «Maiorca, Ilhas Baleares»).
      </DocP>

      <DocH3>Fotos e vídeos</DocH3>
      <DocFigure
        src="/docs-media/pt/propiedades-fotos.webp"
        alt="A galeria de fotos de um imóvel"
        width={1452}
        height={946}
        markers={[
          { x: 4.1, y: 16.3, label: "O que carrega aqui vê-se no site e guarda-se no momento." },
          { x: 61.8, y: 29, label: "As secções da galeria; «Adicionar» cria uma nova." },
          { x: 40.2, y: 46.6, label: "Arraste ou escolha fotos: são carregadas para a secção marcada." },
          { x: 4.7, y: 64.3, label: "A foto de capa." },
        ]}
      />
      <DocList>
        <li>
          Arraste as fotos para o quadro ou clique para as escolher (JPG, PNG, WebP ou HEIC). São otimizadas
          automaticamente antes de serem carregadas.
        </li>
        <li>
          As fotos agrupam-se por secção (Geral, Quartos, Sala, Piscina, Exterior, Instalações adicionais, Vistas ou uma
          sua). Arraste-as para as ordenar dentro da secção, ou use «Mover para outra secção».
        </li>
        <li>A primeira foto é a capa. Para a mudar, use «Tornar capa» noutra.</li>
        <li>Para retirar uma foto toque na cruz e confirme com um segundo clique.</li>
        <li>
          <strong>Marca de água:</strong> põe o logótipo da sua agência sobre as fotos publicadas.
        </li>
        <li>
          <strong>Vídeos:</strong> cole links do YouTube, Vimeo ou outras plataformas.
        </li>
      </DocList>

      <DocH3>Só em arrendamentos</DocH3>
      <DocTerms
        items={[
          [
            "Disponibilidade",
            "Bloqueie datas manualmente com uma nota opcional. As reservas confirmadas bloqueiam as suas datas sozinhas. Para evitar reservas duplas, cole o link iCal do Airbnb ou do Booking e toque em «Sincronizar agora». Se o imóvel estiver publicado, tem também um link para exportar a sua disponibilidade para essas plataformas.",
          ],
          [
            "Tarifas",
            "Períodos de tarifa (por exemplo «Época alta») com datas, preço oficial por noite, estadia mínima, taxa de gestão e comissão da agência.",
          ],
        ]}
      />
      <DocFigure
        src="/docs-media/pt/propiedades-disponibilidad.webp"
        alt="A secção Disponibilidade de um arrendamento"
        width={1452}
        height={625}
        markers={[
          { x: 23.3, y: 8.5, label: "Bloquear datas manualmente, com uma nota opcional." },
          { x: 4.7, y: 48.4, label: "As datas ocupadas: «BOOKING» vem de uma reserva, «MANUAL» de um bloqueio seu, que pode retirar." },
          { x: 23.3, y: 66.5, label: "Cole o link iCal do Airbnb ou do Booking e sincronize." },
          { x: 23.3, y: 82.7, label: "O seu calendário, para o carregar nessas plataformas." },
        ]}
      />
      <DocFigure
        src="/docs-media/pt/propiedades-tarifas.webp"
        alt="A secção Tarifas com três épocas registadas"
        width={1452}
        height={681}
        markers={[
          { x: 26.9, y: 10.5, label: "Um período novo: etiqueta, datas, preço por noite e estadia mínima." },
          { x: 14.6, y: 41, label: "Taxa de gestão (10 % por defeito) e comissão da agência (20 % por defeito), em %." },
          { x: 15.6, y: 90.3, label: "As épocas registadas, com o seu preço e estadia mínima. «Retirar» apaga uma." },
        ]}
      />
      <DocTip>
        Para ver todos os seus imóveis para arrendamento num só calendário, use <strong>Disponibilidade</strong> no menu.
      </DocTip>

      <DocH3>Recomendações</DocH3>
      <DocFigure
        src="/docs-media/pt/propiedades-recomendaciones.webp"
        alt="A secção Recomendações com duas melhorias registadas"
        width={1452}
        height={847}
        markers={[{ x: 10.8, y: 64.5, label: "Cada melhoria com o seu detalhe, custo estimado e prioridade." }]}
      />
      <DocP>
        Servem para propor melhorias ao proprietário: renovar o mobiliário, juntar um carregador para carros… Cada uma tem
        prioridade (alta, média ou baixa) e um estado que vai mudando: proposta, aprovada ou feita. O proprietário vê-as na
        sua página, em «Melhorias sugeridas».
      </DocP>

      <DocTip>
        Complete primeiro Básico, Localização, Preços e Fotos: com isso a ficha já fica bem no seu site. O resto pode ir
        juntando com o tempo.
      </DocTip>
    </DocSection>
  );
}

function Owners() {
  return (
    <DocSection
      id="propietarios"
      icon={KeyRound}
      title="Proprietários"
      intro="Os donos dos imóveis que comercializa. Cada um tem uma página privada onde acompanha os seus imóveis, as suas reservas e o que lhe cabe, sem precisar de utilizador nem palavra-passe."
    >
      <DocH3>Atribuir um proprietário</DocH3>
      <DocSteps>
        <DocStep>
          No editor do imóvel, abra <strong>Contacto</strong> → <strong>Proprietário</strong>.
        </DocStep>
        <DocStep>Pesquise-o por nome, email ou telefone, ou toque em «Novo proprietário» para o registar ali mesmo.</DocStep>
        <DocStep>Guarde o imóvel. Um mesmo proprietário pode ter vários imóveis.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/pt/propietarios-asignar.webp"
        alt="A secção Proprietário com um proprietário atribuído e o seu link de acesso"
        width={1452}
        height={1111}
        markers={[
          { x: 24.9, y: 14.3, label: "O proprietário atribuído; «Retirar» desvincula-o." },
          { x: 37.1, y: 38.4, label: "Copie o seu link pessoal para lho enviar." },
          { x: 47.6, y: 38.4, label: "Regenerar: o link anterior deixa de funcionar." },
          { x: 7.6, y: 46.4, label: "O seu extrato de conta." },
        ]}
      />

      <DocH3>Extrato de conta</DocH3>
      <DocP>
        Por baixo do acesso está o extrato de conta do proprietário, com todos os seus imóveis juntos. Só o veem titulares
        e administradores da agência.
      </DocP>
      <DocFigure
        src="/docs-media/pt/propietarios-cuenta.webp"
        alt="O extrato de conta de um proprietário com o cobrado, a comissão, o liquidado e o saldo"
        width={1100}
        height={1148}
        className="max-w-2xl"
        markers={[
          { x: 16.3, y: 18.1, label: "O cobrado nas reservas dos seus imóveis, do total reservado." },
          { x: 83.7, y: 18.1, label: "O que lhe cabe: o cobrado menos a comissão." },
          { x: 50, y: 30.4, label: "O que falta liquidar-lhe." },
          { x: 50, y: 79.1, label: "As liquidações: o que já lhe pagou. O caixote apaga uma." },
          { x: 14.5, y: 96.4, label: "Registar um pagamento ao proprietário." },
        ]}
      />
      <DocTerms
        items={[
          ["Cobrado", "A soma dos pagamentos marcados como cobrados nas suas reservas (sinais e saldos)."],
          ["Comissão", "A comissão da agência nessas reservas; desconta-se do cobrado."],
          ["Cabe-lhe", "O cobrado menos a comissão."],
          ["Já liquidado", "A soma das liquidações que registou."],
          ["Saldo por liquidar", "O que ainda lhe deve. Se lhe pagou a mais, indica-o."],
          ["Por reserva", "O detalhe de cada reserva: datas, quanto se cobrou de quanto e a comissão."],
        ]}
      />
      <DocSteps>
        <DocStep>
          Toque em <strong>Registar liquidação</strong>. Já vem preenchido o saldo pendente e a sua moeda.
        </DocStep>
        <DocStep>Ajuste o montante se for preciso e escolha a data.</DocStep>
        <DocStep>Escreva o meio (transferência, numerário…) e uma nota se quiser, e toque em «Registar».</DocStep>
      </DocSteps>

      <DocH3>A página do proprietário</DocH3>
      <DocP>
        Em «Acesso do proprietário» está o seu link pessoal: copie-o e envie-lho. A partir daí vê os seus imóveis e o seu
        estado (publicado ou não, com o preço publicado), a estadia em curso ou a próxima, as reservas com as suas datas e
        pagamentos, o seu extrato de conta e as melhorias sugeridas que registou em Recomendações. Um botão permite-lhe
        escrever-lhe por WhatsApp ou email.
      </DocP>
      <DocFigure
        src="/docs-media/pt/propietarios-pagina.webp"
        alt="A página do proprietário com o resumo dos seus imóveis e o seu extrato de conta"
        width={1584}
        height={946}
        markers={[
          { x: 24, y: 38.9, label: "Quantos dos seus imóveis estão publicados." },
          { x: 50, y: 38.9, label: "A estadia em curso ou a próxima." },
          { x: 75.2, y: 38.9, label: "O que lhe cabe do cobrado." },
          { x: 50, y: 66.1, label: "O seu extrato de conta: o liquidado, o saldo e o detalhe por reserva." },
          { x: 84.3, y: 4.2, label: "Um botão para lhe escrever." },
        ]}
      />
      <DocP>
        Por defeito o proprietário <strong>não vê a sua comissão</strong>: vê quanto lhe cabe, mas não quanto foi
        descontado. Se lha quiser mostrar, ative «Mostrar a comissão da agência» nas Definições.
      </DocP>
      <DocTip>
        Se o link chegou a quem não devia, toque em «Regenerar»: o anterior deixa de funcionar de imediato.
      </DocTip>
    </DocSection>
  );
}

function Importer() {
  return (
    <DocSection
      id="importar"
      icon={Upload}
      title="Importar imóveis"
      adminOnly
      intro="Traga a sua carteira de outro sistema de uma só vez: um CRM, um portal ou uma folha de cálculo. Nada é guardado até rever o que vai acontecer a cada imóvel."
    >
      <DocP>
        Abre-se a partir de <strong>Importar</strong>, na barra de Imóveis. O processo tem quatro passos: escolher de onde
        vem, trazer o ficheiro, dizer o que é cada coluna (só em folhas de cálculo) e rever.
      </DocP>

      <DocH3>1. Escolha de onde migra</DocH3>
      <DocFigure
        src="/docs-media/pt/importar-plataformas.webp"
        alt="A lista de plataformas a partir das quais se pode migrar"
        width={1276}
        height={946}
        markers={[
          { x: 16.5, y: 18.6, label: "Pesquise o seu sistema por nome ou país." },
          { x: 52.4, y: 18.6, label: "Filtre por CRM, portais ou agregadores." },
          { x: 35.8, y: 44, label: "Escolha a sua plataforma: mostramos-lhe como tirar os seus dados de lá." },
        ]}
      />
      <DocP>
        Há quase 50 plataformas (Idealista, Inmovilla, Kyero, CASAFARI, Resales Online, Witei, Apimo, Rightmove e muitas
        mais), as mais usadas primeiro. Se a sua não estiver, em baixo pode usar um <strong>CSV ou Excel</strong>, um{" "}
        <strong>XML da Kyero</strong> (o formato que a maioria dos CRM exporta) ou o <strong>XML da Tivvo</strong>, se o seu
        sistema tiver API própria.
      </DocP>

      <DocH3>2. Traga os seus dados</DocH3>
      <DocFigure
        src="/docs-media/pt/importar-fuente.webp"
        alt="O guia para migrar do Idealista, com a caixa para carregar o ficheiro"
        width={1276}
        height={946}
        markers={[
          { x: 28.6, y: 21.3, label: "Os passos para tirar os seus imóveis dessa plataforma." },
          { x: 9.9, y: 42.9, label: "Outro caminho, se a sua plataforma lhe der um CSV ou Excel." },
          { x: 28.6, y: 50, label: "Ficou preso? Preparamos o pedido à plataforma ou ajudamo-lo nós." },
          { x: 70, y: 22.6, label: "Carregue o ficheiro ou cole o URL do feed." },
          { x: 77.9, y: 39.5, label: "Lemos o ficheiro; ainda não se guarda nada." },
        ]}
      />
      <DocList>
        <li>
          Siga os passos do guia da sua plataforma. Muitas pedem o feed através do suporte: em «Ficou preso?» toque em{" "}
          <strong>Enviar pedido por email</strong> e abre-se o seu correio com a mensagem já escrita, ou copie-a com «Ver
          mensagem».
        </li>
        <li>
          <strong>Carregar ficheiro:</strong> CSV ou Excel (.xlsx) até 10 MB e 3.000 linhas, ou XML até 10 MB.
        </li>
        <li>
          <strong>Usar um URL:</strong> cole o link público do feed. Lemo-lo uma só vez; não fica sincronizado.
        </li>
        <li>
          Se começar do zero, toque em <strong>Descarregar modelo CSV</strong>: tem as colunas que entendemos e uma linha
          de exemplo.
        </li>
        <li>«Pedir ajuda» permite escrever-nos com a mensagem já preparada: ajudamo-lo a migrar.</li>
      </DocList>

      <DocH3>3. O que é cada coluna</DocH3>
      <DocP>Só em folhas de cálculo (CSV ou Excel). A Tivvo reconhece sozinha a maioria das colunas; reveja as restantes.</DocP>
      <DocFigure
        src="/docs-media/pt/importar-mapeo.webp"
        alt="O passo para atribuir cada coluna do ficheiro a um campo da Tivvo"
        width={1304}
        height={1132}
        markers={[
          { x: 49, y: 14.4, label: "Quantas linhas e colunas reconhecemos." },
          { x: 13.1, y: 27.2, label: "As colunas que não reconhecemos vêm primeiro, com exemplos do seu ficheiro." },
          { x: 81.7, y: 27.2, label: "Escolha a que campo da Tivvo corresponde, ou «Não importar»." },
          { x: 14.8, y: 95.5, label: "Ver o que vai acontecer a cada linha, antes de guardar." },
        ]}
      />
      <DocList>
        <li>Cada campo sai de uma só coluna: se o escolher noutra, liberta-se na anterior.</li>
        <li>As colunas sem atribuir são ignoradas. Uma célula vazia nunca apaga o que já está registado.</li>
        <li>
          Atribua uma coluna de <strong>referência (ID)</strong>: assim, se voltar a importar o ficheiro, os imóveis
          atualizam-se em vez de se duplicarem. Se não houver, avisamos.
        </li>
      </DocList>

      <DocH3>4. Reveja e importe</DocH3>
      <DocFigure
        src="/docs-media/pt/importar-revision.webp"
        alt="A pré-visualização da importação com o resumo e o detalhe por linha"
        width={1304}
        height={853}
        markers={[
          { x: 9.4, y: 20.9, label: "O resumo: novos, a atualizar, sem alterações, omitidos e com erro. Toque num para filtrar." },
          { x: 21.4, y: 31.2, label: "Publicá-los diretamente ou deixá-los como rascunho." },
          { x: 24.1, y: 38.2, label: "Mandar para o lixo o que já não está no ficheiro." },
          { x: 9.1, y: 49.3, label: "Linha a linha, com os seus avisos, erros e o que muda." },
          { x: 14.3, y: 94.1, label: "Só aqui se guarda tudo." },
        ]}
      />
      <DocTerms
        items={[
          ["Novo", "Não estava na Tivvo: é criado."],
          ["Atualiza", "Já o tinha importado (mesma referência): muda o que diz o detalhe, por exemplo preço ou fotos."],
          ["Sem alterações", "Já está igual na Tivvo."],
          ["Omitido", "Não se importa, por exemplo porque se repete no ficheiro."],
          ["Com erro", "Falta-lhe algo obrigatório, como o título. O detalhe diz o quê."],
        ]}
      />
      <DocList>
        <li>
          <strong>Publicar os novos ao importar:</strong> desligado, ficam como rascunho para os rever antes de os mostrar
          no seu site.
        </li>
        <li>
          <strong>Mandar para o lixo o que já não está no ficheiro:</strong> só afeta imóveis que trouxe antes dessa mesma
          plataforma, e pedimos confirmação. Podem ser restaurados durante 30 dias.
        </li>
        <li>
          Ao tocar em <strong>Importar</strong>, a Tivvo guarda os imóveis e descarrega as suas fotos. Se forem muitos pode
          demorar alguns minutos: não feche o separador. Se tentar sair antes de terminar, avisamos.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/pt/importar-listo.webp"
        alt="O ecrã final da importação com o resumo e os erros"
        width={1100}
        height={395}
        className="max-w-2xl"
        markers={[
          { x: 50, y: 47, label: "O que foi feito, com o detalhe dos erros." },
          { x: 38.2, y: 68.5, label: "Descarregue os erros num CSV para os corrigir." },
          { x: 37.3, y: 81.5, label: "Reveja os rascunhos ou veja o seu site; «Importar outro ficheiro» começa de novo." },
        ]}
      />
    </DocSection>
  );
}

function Offers() {
  return (
    <DocSection
      id="ofertas"
      icon={Tag}
      title="Ofertas"
      intro="Propostas personalizadas para um cliente: uma seleção de imóveis e serviços com os seus preços, apresentada numa página própria que o cliente abre a partir de um link."
    >
      <DocH3>Montar uma oferta</DocH3>
      <DocSteps>
        <DocStep>
          Toque em <strong>Nova oferta</strong>, dê-lhe um título (por exemplo «Proposta para a família Pérez»), escolha a
          operação (venda, arrendamento ou ambas) e, se quiser, um código de referência. A operação define que imóveis
          pode juntar.
        </DocStep>
        <DocStep>
          Em <strong>Geral</strong> escolha o cliente, a moeda e se quer mostrar os preços e a identidade da sua agência
          (cabeçalho, rodapé e contactos).
        </DocStep>
        <DocStep>
          Em <strong>Boas-vindas</strong> escreva a saudação: um título, a data ou temporada e uma mensagem.
        </DocStep>
        <DocStep>
          Em <strong>Imóveis</strong> crie secções (por exemplo «À beira-mar») e junte-lhes imóveis.
        </DocStep>
        <DocStep>
          Em <strong>Serviços</strong> acrescente experiências da sua biblioteca: chef, transferes, iate…
        </DocStep>
        <DocStep>
          Toque em <strong>Enviar oferta</strong> (se tiver cliente) ou <strong>Publicar link</strong> (se não tiver).
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/pt/ofertas-nueva.webp"
        alt="O diálogo Nova oferta"
        width={784}
        height={838}
        className="max-w-md"
        markers={[
          { x: 50, y: 31.1, label: "O título." },
          { x: 50, y: 59, label: "Um código de referência opcional, como o do seu sistema." },
          { x: 50, y: 48.6, label: "Venda, arrendamento ou ambas: define que imóveis pode juntar." },
        ]}
      />
      <DocFigure
        src="/docs-media/pt/ofertas-lista.webp"
        alt="A lista de ofertas"
        width={1304}
        height={946}
        markers={[
          { x: 24.7, y: 6, label: "Pesquisa por título ou cliente." },
          { x: 52.5, y: 6, label: "Filtros por operação e estado." },
          { x: 89.9, y: 6, label: "Nova oferta." },
          { x: 5.8, y: 60.5, label: "O estado: aqui, o cliente já a abriu." },
          { x: 17, y: 47.3, label: "O seu código de referência, se lhe pôs um." },
        ]}
      />

      <DocH3>O editor</DocH3>
      <DocFigure
        src="/docs-media/pt/ofertas-editor.webp"
        alt="O editor de uma oferta na secção Geral"
        width={1480}
        height={1100}
        markers={[
          { x: 14.4, y: 4.6, label: "As secções: Geral, Boas-vindas, Imóveis e Serviços." },
          { x: 30.3, y: 37.1, label: "O cliente que a recebe por email." },
          { x: 18.2, y: 76.2, label: "Mostrar ou ocultar os preços." },
          { x: 15.7, y: 84.8, label: "Mostrar o seu logótipo, cabeçalho e contactos." },
          { x: 84.5, y: 25.4, label: "O resumo, o link para o cliente e «Ver cliente»." },
          { x: 90, y: 4.6, label: "Enviar, reenviar ou publicar o link." },
        ]}
      />
      <DocP>
        À direita vê o estado, quantos imóveis e serviços tem e o total. Em arrendamentos não há total: são opções para
        escolher, com preço por noite. Depois de enviada ou publicada, está lá o link para o cliente com «Copiar link».
      </DocP>

      <DocH3>Ajustar o preço de cada imóvel</DocH3>
      <DocFigure
        src="/docs-media/pt/ofertas-propiedades.webp"
        alt="A secção Imóveis de uma oferta com os ajustes de preço abertos"
        width={1480}
        height={1292}
        markers={[
          { x: 28.6, y: 12.4, label: "Cada secção com o seu título e um texto." },
          { x: 17.1, y: 33, label: "Preço especial, desconto e caução só para esta oferta." },
          { x: 30.3, y: 50.4, label: "Um texto curto por baixo do imóvel." },
        ]}
      />
      <DocP>
        «Mostrar ajustes» em cada imóvel permite-lhe pôr um preço especial para esta oferta, um desconto (percentagem ou
        montante fixo), uma caução e um texto curto como «Inclui limpeza final». O cliente vê o preço anterior riscado. O
        preço do imóvel na sua carteira não muda.
      </DocP>

      <DocH3>Serviços na oferta</DocH3>
      <DocFigure
        src="/docs-media/pt/ofertas-servicios.webp"
        alt="A secção Serviços de uma oferta com um chef privado e um transfere"
        width={1480}
        height={814}
        markers={[
          { x: 7.7, y: 93.5, label: "Junte um serviço da sua biblioteca." },
          { x: 30.3, y: 9.9, label: "Ajuste preço, quantidade, data e uma nota para o cliente." },
          { x: 52.6, y: 43.7, label: "O subtotal de cada serviço." },
        ]}
      />
      <DocP>
        Os serviços vêm da sua biblioteca (ver «Serviços»). Ao juntá-lo à oferta pode mudar o preço, a quantidade
        (pessoas, dias, noites ou horas, consoante a forma de cobrança), a data e deixar uma nota. Sem preço, o cliente vê
        «Sob consulta».
      </DocP>

      <DocH3>Enviar ou partilhar</DocH3>
      <DocTerms
        items={[
          ["Com cliente", "«Enviar oferta» envia-lhe o link por email. Depois pode usar «Reenviar oferta» quando quiser."],
          ["Sem cliente", "«Publicar link» ativa a página e é você quem partilha o link onde preferir."],
          ["Copiar link", "Disponível no painel direito do editor e no menu ⋯ de cada oferta, depois de enviada ou publicada."],
        ]}
      />
      <DocP>
        Se enviou o link por conta própria (WhatsApp, por exemplo), use «Marcar como enviada» no menu da oferta. Quando o
        cliente a abre, a oferta passa a «Vista» e recebe uma notificação. Na página da oferta o cliente pode escrever-lhe:
        esse pedido chega a Pedidos.
      </DocP>

      <DocH3>Estados</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Rascunho</DocPill>, "Ainda ninguém a vê."],
          [<DocPill key="s" tone="primary">Enviada</DocPill>, "O link está ativo e foi enviado ao cliente."],
          [<DocPill key="v">Vista</DocPill>, "O cliente já abriu a oferta."],
          [<DocPill key="e">Expirada</DocPill>, "Passou a data de validade; o cliente vê um aviso de que expirou."],
        ]}
      />
    </DocSection>
  );
}

function Bookings() {
  return (
    <DocSection
      id="reservas"
      icon={CalendarDays}
      title="Reservas"
      intro="Cada operação fechada: um arrendamento com as suas datas ou uma venda, com o preço, a comissão e o acompanhamento dos pagamentos."
    >
      <DocFigure
        src="/docs-media/pt/reservas-lista.webp"
        alt="A lista de reservas"
        width={1304}
        height={946}
        markers={[
          { x: 23.9, y: 6, label: "Pesquise por imóvel ou cliente." },
          { x: 49.9, y: 6, label: "Filtre por estado ou pela localização do imóvel." },
          { x: 89.6, y: 6, label: "Nova reserva." },
          { x: 6.8, y: 40.5, label: "O estado de cada reserva." },
        ]}
      />

      <DocH3>Criar uma reserva</DocH3>
      <DocSteps>
        <DocStep>
          Toque em <strong>Nova reserva</strong> e escolha o imóvel.
        </DocStep>
        <DocStep>Atribua o cliente (opcional).</DocStep>
        <DocStep>Em arrendamentos, escolha as datas de entrada e saída. Uma venda vai sem datas.</DocStep>
        <DocStep>Registe o preço total e a sua comissão, e toque em «Criar reserva».</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/pt/reservas-nueva.webp"
        alt="O diálogo Nova reserva"
        width={784}
        height={839}
        className="max-w-md"
        markers={[
          { x: 50, y: 23.9, label: "O imóvel." },
          { x: 50, y: 40, label: "O cliente (opcional)." },
          { x: 50, y: 55.3, label: "Entrada e saída, só em arrendamentos." },
          { x: 72.9, y: 71.4, label: "Preço total e a sua comissão." },
        ]}
      />

      <DocH3>Estados</DocH3>
      <DocTerms
        items={[
          [
            <DocPill key="p" tone="amber">Pendente</DocPill>,
            "Acabada de criar, à espera de confirmação. Ainda não bloqueia as datas, mas em Disponibilidade vê-se a âmbar.",
          ],
          [<DocPill key="c" tone="primary">Confirmada</DocPill>, "Está firme e bloqueia as suas datas."],
          [<DocPill key="o">Concluída</DocPill>, "A estadia terminou ou a venda foi fechada."],
          [<DocPill key="x">Cancelada</DocPill>, "Não vai acontecer: as datas são libertadas. Os pagamentos registados não são apagados."],
        ]}
      />
      <DocP>
        Mude o estado a partir da ficha da reserva ou do menu ⋯ da lista. Antes de cancelar pedimos confirmação.
        «Eliminar» envia-a para o lixo.
      </DocP>

      <DocH3>A ficha da reserva</DocH3>
      <DocFigure
        src="/docs-media/pt/reservas-ficha.webp"
        alt="A ficha de uma reserva com a estadia, os pagamentos e o resumo"
        width={1304}
        height={1210}
        markers={[
          { x: 5.1, y: 21.5, label: "As datas e o número de noites." },
          { x: 57.8, y: 51.3, label: "Registar um sinal, o saldo ou a sua comissão." },
          { x: 57.1, y: 64.9, label: "Marcar um pagamento como cobrado." },
          { x: 82.4, y: 12, label: "Total, comissão, cobrado e por cobrar." },
          { x: 82.4, y: 28.7, label: "A página que o cliente vê: copie o link ou abra-a." },
          { x: 82.4, y: 40.5, label: "Confirmar, concluir ou cancelar." },
        ]}
      />

      <DocH3>Pagamentos</DocH3>
      <DocP>
        «Adicionar pagamento» regista um <strong>sinal</strong>, o <strong>saldo</strong> ou a sua <strong>comissão</strong>,
        na moeda da reserva. Cada pagamento fica pendente até o marcar como cobrado; ao cobrá-lo fica com a data. A barra
        mostra quanto se cobrou do total.
      </DocP>
      <DocFigure
        src="/docs-media/pt/reservas-pago.webp"
        alt="O diálogo Adicionar pagamento"
        width={700}
        height={544}
        className="max-w-sm"
        caption="Escolha o tipo, escreva o montante e guarde. Fica pendente até o marcar como cobrado."
      />
      <DocP>
        Os pagamentos cobrados alimentam o extrato de conta do proprietário: o cobrado menos a comissão é o que lhe cabe.
      </DocP>

      <DocH3>A página do cliente</DocH3>
      <DocP>
        Cada reserva tem uma página para o cliente com o imóvel, a sua estadia, o estado e os pagamentos (sinais e saldo,
        nunca a comissão). Se a reserva tiver cliente, recebe-a por email ao criá-la, confirmá-la ou cancelá-la. Se não,
        copie o link a partir da ficha ou do menu ⋯ e envie-lho você. Ver «O que veem os seus clientes».
      </DocP>
    </DocSection>
  );
}

function Availability() {
  return (
    <DocSection
      id="disponibilidad"
      icon={CalendarCheck}
      title="Disponibilidade"
      intro="Todos os seus imóveis para arrendamento num só calendário: o que está livre e o que está ocupado, para responder depressa a um pedido e bloquear datas sem entrar em cada imóvel."
    >
      <DocP>
        Tem duas vistas, que escolhe à direita: <strong>Próximos 90 dias</strong> (uma grelha com uma linha por imóvel) e{" "}
        <strong>Mensal</strong> (um calendário). Só aparecem os imóveis para arrendamento.
      </DocP>

      <DocH3>Próximos 90 dias</DocH3>
      <DocFigure
        src="/docs-media/pt/disponibilidad-grilla.webp"
        alt="A grelha de disponibilidade dos próximos 90 dias"
        width={1304}
        height={704}
        markers={[
          { x: 12.8, y: 20, label: "Pesquise um imóvel ou filtre por localização." },
          { x: 69.1, y: 20, label: "Escolha datas para ver que imóveis estão livres." },
          { x: 88.5, y: 20, label: "Próximos 90 dias ou Mensal." },
          { x: 86.6, y: 8.1, label: "O link público da sua disponibilidade, para partilhar." },
          { x: 37.2, y: 27.2, label: "O que significa cada cor." },
          { x: 13, y: 48.9, label: "Cada linha é um imóvel; toque no nome para o abrir." },
        ]}
      />
      <DocTerms
        items={[
          ["Verde", "Disponível."],
          ["Vermelho", "Reservado ou bloqueado."],
          ["Metade e metade", "Dia de entrada (check-in, ocupado a partir da tarde) ou de saída (check-out, ocupado até de manhã)."],
          ["Âmbar", "Uma reserva pendente: ainda não bloqueia as datas, mas foi pedida."],
          ["Cinzento", "Dias passados."],
        ]}
      />
      <DocList>
        <li>Os imóveis agrupam-se por região. Passe o rato por um dia para ver o que é.</li>
        <li>
          Ao escolher datas, esses dias ficam realçados e com <strong>Só livres</strong> ficam apenas os imóveis disponíveis
          em todo o intervalo. «Limpar datas» volta atrás.
        </li>
        <li>Mostram-se 25 imóveis; «Ver mais» carrega os seguintes.</li>
      </DocList>

      <DocH3>Mensal</DocH3>
      <DocFigure
        src="/docs-media/pt/disponibilidad-mes.webp"
        alt="O calendário mensal com a ocupação de cada dia"
        width={1304}
        height={1298}
        markers={[
          { x: 6.4, y: 10.7, label: "Mudar de mês; «Hoje» volta ao atual." },
          { x: 67.9, y: 10.7, label: "Escolha um imóvel para ver as suas reservas e bloquear datas." },
          { x: 67.7, y: 52.5, label: "Quantos imóveis estão ocupados nessa noite." },
          { x: 62.4, y: 54.9, label: "Quais: cada imóvel com a sua cor. Os pendentes, com contorno tracejado." },
        ]}
      />
      <DocP>
        Com <strong>Todos os imóveis</strong>, cada dia diz quantos estão ocupados nessa noite (a vermelho se estiverem
        todos) e quais, cada um sempre com a mesma cor. Passe o rato para ver a lista completa. Ao tocar num dia, em baixo
        aparecem os ocupados, os pendentes e os livres:
      </DocP>
      <DocFigure
        src="/docs-media/pt/disponibilidad-dia.webp"
        alt="O detalhe de um dia com os imóveis ocupados e livres"
        width={1100}
        height={234}
        className="max-w-2xl"
        markers={[
          { x: 25.5, y: 29.5, label: "O que está ocupado, pendente e livre nesse dia." },
          { x: 46.5, y: 43, label: "«Ver mês» abre o calendário desse imóvel; o nome abre o imóvel." },
        ]}
      />

      <DocH3>Bloquear datas a partir do calendário</DocH3>
      <DocSteps>
        <DocStep>
          Na vista <strong>Mensal</strong>, escolha o imóvel em cima à direita.
        </DocStep>
        <DocStep>
          Arraste sobre as noites livres que quer bloquear. Com o teclado: <Kbd>Enter</Kbd> no primeiro dia e{" "}
          <Kbd>Enter</Kbd> no último.
        </DocStep>
        <DocStep>
          Em baixo aparece o resumo («4 noites, de 25 out a 29 out»). Escreva uma nota se quiser e toque em{" "}
          <strong>Bloquear</strong>.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/pt/disponibilidad-bloquear.webp"
        alt="O calendário de um imóvel com quatro noites marcadas para bloquear"
        width={1304}
        height={1141}
        markers={[
          { x: 48.9, y: 89.2, label: "Os dias de uma reserva: entrada, noites ocupadas e saída." },
          { x: 8.7, y: 74.3, label: "Arraste sobre as noites livres para as marcar." },
          { x: 22.9, y: 95.6, label: "Confirme o bloqueio, com uma nota opcional." },
        ]}
      />
      <DocP>
        Não se podem marcar noites passadas nem ocupadas. O bloqueio aparece também na secção Disponibilidade do imóvel,
        onde o pode retirar.
      </DocP>

      <DocH3>O link para partilhar</DocH3>
      <DocP>
        «Copiar link para partilhar» copia o endereço da sua disponibilidade pública: a mesma grelha de 90 dias, no seu
        site, com a sua marca. Serve para a enviar a um cliente ou a um colega. Mostra só os imóveis publicados e não
        mostra as reservas pendentes.
      </DocP>
    </DocSection>
  );
}

function Services() {
  return (
    <DocSection
      id="servicios"
      icon={Sparkles}
      title="Serviços"
      intro="A sua biblioteca de experiências e serviços extra. Regista-os uma vez e junta-os a qualquer oferta."
    >
      <DocFigure
        src="/docs-media/pt/servicios-lista.webp"
        alt="A biblioteca de serviços"
        width={1304}
        height={946}
        markers={[
          { x: 20.9, y: 6, label: "Pesquise por nome, tipo ou zona." },
          { x: 89.6, y: 6, label: "Novo serviço." },
          { x: 73.7, y: 52.9, label: "Sem preço, mostra-se «Sob consulta»." },
        ]}
      />

      <DocH3>Criar um serviço</DocH3>
      <DocSteps>
        <DocStep>
          Toque em <strong>Novo serviço</strong> e escolha o tipo: mordomo, chef privado, iate, transferes, carro,
          excursões, spa, babysitter, limpeza extra, eventos ou outro.
        </DocStep>
        <DocStep>Dê-lhe nome, foto e uma descrição: o que inclui, quanto dura, para quantas pessoas.</DocStep>
        <DocStep>
          Defina o preço e como se cobra: por serviço, por pessoa, por dia, por noite ou por hora. Sem preço mostra-se «Sob
          consulta».
        </DocStep>
        <DocStep>Indique onde se oferece (vazio significa em qualquer lugar) e, se quiser, o fornecedor.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/pt/servicios-editar.webp"
        alt="O formulário de um serviço: foto, zonas, preço, unidade de cobrança, fornecedor e disponibilidade"
        width={784}
        height={1628}
        className="max-w-md"
        markers={[
          { x: 50, y: 18.2, label: "A foto do serviço." },
          { x: 50, y: 51.9, label: "As zonas onde se oferece; vazio é em qualquer lugar." },
          { x: 77.5, y: 67.8, label: "Como se cobra: por serviço, pessoa, dia, noite ou hora." },
          { x: 50, y: 71.9, label: "O fornecedor, só para a sua equipa." },
          { x: 89.6, y: 95.9, label: "Disponível para juntar a novas ofertas." },
        ]}
      />
      <DocList>
        <li>Toque num serviço da lista para o editar ou eliminar.</li>
        <li>O fornecedor só é visto pela sua equipa, nunca pelo cliente.</li>
        <li>Se desligar «Disponível», o serviço não pode ser juntado a novas ofertas, mas continua nas que já o têm.</li>
        <li>Em cada oferta pode ajustar preço, quantidade e data do serviço para esse cliente, e deixar-lhe uma nota.</li>
      </DocList>
    </DocSection>
  );
}

function Portal() {
  return (
    <DocSection
      id="portal"
      icon={Globe}
      title="Site"
      adminOnly
      intro="O site público da sua agência, onde os seus clientes veem os seus imóveis publicados e lhe escrevem. É seu: tem o seu nome, o seu logótipo e as suas cores."
    >
      <DocP>
        Edita-se a partir de <strong>Site</strong> no menu. O editor ocupa o ecrã inteiro: à esquerda as opções, à direita
        uma pré-visualização que pode ver como computador ou como telemóvel. Guarde para publicar as alterações; se tentar
        sair com alterações por guardar, avisamos.
      </DocP>
      <DocFigure
        src="/docs-media/pt/portal-editor.webp"
        alt="O editor do site no separador Design, com a pré-visualização à direita"
        width={1760}
        height={990}
        markers={[
          { x: 14, y: 9.8, label: "Os separadores: Design, Capa, Blocos e Agência e contacto." },
          { x: 5.8, y: 28.8, label: "Escolha se está a configurar a versão de computador ou de telemóvel." },
          { x: 69.9, y: 3.5, label: "Ver a pré-visualização como computador ou como telemóvel." },
          { x: 83.8, y: 3.5, label: "Ver o site publicado." },
          { x: 94, y: 3.5, label: "Guardar alterações publica o que editou." },
          { x: 66, y: 57.1, label: "A pré-visualização, tal como os seus clientes a verão." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Design",
            "O modelo da página inicial (Capa, Editorial, Compacto, Dividido ou Mosaico), que pode ser diferente em telemóveis; a cor de botões e links (uma da paleta ou outra pelo seu código, como #1F5F4A); e a tipografia (Moderna, Clássica, Sóbria, Elegante, Editorial, Calorosa, Urbana ou Arquitetónica).",
          ],
          [
            "Capa",
            "A foto principal (melhor na horizontal, com pelo menos 1920 px de largura) e, no modelo Mosaico, as quatro fotos da colagem. Também o título e o texto da capa.",
          ],
          [
            "Blocos",
            "Secções próprias entre a capa e a lista. Cada uma tem vários designs e pode ser ocultada sem a apagar.",
          ],
          [
            "Agência e contacto",
            "O texto sobre a sua agência, telefone, WhatsApp (ativa o botão «Escreva-nos por WhatsApp»), Instagram e a morada do escritório.",
          ],
        ]}
      />

      <DocH3>Tipos de bloco</DocH3>
      <DocFigure
        src="/docs-media/pt/portal-bloques.webp"
        alt="O separador Blocos com três blocos do site"
        width={896}
        height={1038}
        className="max-w-sm"
        markers={[
          { x: 36.7, y: 50.3, label: "Cada bloco, com o seu tipo e design. Toque nele para o editar." },
          { x: 66.7, y: 51.9, label: "Ocultá-lo sem o apagar." },
          { x: 81.9, y: 51.9, label: "Subi-lo ou descê-lo." },
          { x: 89.5, y: 51.9, label: "Apagá-lo." },
          { x: 49.9, y: 90.4, label: "Adicionar um bloco novo: escolhe o tipo, depois o seu design e o seu conteúdo." },
        ]}
      />
      <DocTerms
        items={[
          ["Localização", "Uma zona com foto, texto e os seus imóveis. Designs: Destaque, Banner ou Carrossel."],
          [
            "Promoção",
            "Imóveis com uma etiqueta como «15% OFF», com data de validade opcional. Designs: Faixa de cor, Banner com foto ou Carrossel.",
          ],
          ["Imóveis em destaque", "Uma seleção sua: os mais recentes, à beira-mar, os mais procurados. Designs: Grelha ou Carrossel."],
          ["Destinos", "Várias zonas ao mesmo tempo, cada uma com a sua foto. Ao tocar numa, a lista é filtrada. Designs: Mosaico ou Carrossel."],
          [
            "Texto e imagem",
            "Conte algo seu: os seus serviços, avaliações, como trabalham. Imagem à esquerda, à direita ou só texto.",
          ],
          [
            "Chamada à ação",
            "Um convite com um botão que leva ao formulário de contacto, ao WhatsApp ou à lista. Designs: Cor ou Com foto.",
          ],
        ]}
      />

      <DocH3>Agência e contacto</DocH3>
      <DocFigure
        src="/docs-media/pt/portal-agencia.webp"
        alt="O separador Agência e contacto do editor do site"
        width={896}
        height={1886}
        className="max-w-xs"
        caption="O texto «Sobre a sua agência» e os contactos que aparecem no rodapé e no botão de contacto do site."
      />
      <DocTip>
        Para ver como ficou, use «Ver publicado» no editor ou «Ver o meu site» no menu do seu perfil.
      </DocTip>
    </DocSection>
  );
}

function ClientPages() {
  return (
    <DocSection
      id="lo-que-ven-tus-clientes"
      icon={Eye}
      title="O que veem os seus clientes"
      intro="As páginas públicas que a Tivvo gera: o seu site, a ficha de cada imóvel, as ofertas, as reservas, a página do proprietário e a sua disponibilidade. Nenhuma pede utilizador nem palavra-passe."
    >
      <DocH3>O seu site</DocH3>
      <DocFigure
        src="/docs-media/pt/portal-publico.webp"
        alt="O site público de uma agência com a capa e a pesquisa"
        width={1584}
        height={946}
        caption="A capa com a pesquisa (operação, zona e tipo), os seus blocos, a lista de imóveis publicados e o contacto."
      />
      <DocList>
        <li>Mostra só os imóveis publicados. As fichas têm galeria, mapa com a localização visível e formulário de pedido.</li>
        <li>Os pedidos do formulário chegam a Pedidos e criam o cliente.</li>
        <li>Altera-o a partir de Site (ver «Site»); o endereço, a partir das Definições.</li>
      </DocList>

      <DocH3>A oferta</DocH3>
      <DocFigure
        src="/docs-media/pt/ofertas-cliente.webp"
        alt="A página de uma oferta tal como o cliente a vê"
        width={1584}
        height={990}
        caption="A saudação, as secções com os seus imóveis (com o preço especial e o anterior riscado) e os serviços. Em baixo, um formulário para lhe escrever."
      />

      <DocH3>A reserva</DocH3>
      <DocFigure
        src="/docs-media/pt/reservas-cliente.webp"
        alt="A página de uma reserva confirmada tal como o cliente a vê"
        width={1584}
        height={946}
        caption="O estado, o imóvel, as datas e os pagamentos: total, pago e o que falta. Nunca mostra a sua comissão."
      />

      <DocH3>A sua disponibilidade</DocH3>
      <DocFigure
        src="/docs-media/pt/disponibilidad-publica.webp"
        alt="A disponibilidade pública da agência"
        width={1584}
        height={946}
        caption="Os próximos 90 dias dos seus arrendamentos publicados, com pesquisa, localização e datas. Não mostra reservas pendentes."
      />

      <DocH3>A página do proprietário</DocH3>
      <DocP>Ver «Proprietários».</DocP>
    </DocSection>
  );
}

function Team() {
  return (
    <DocSection
      id="equipo"
      icon={UsersRound}
      title="Equipa"
      adminOnly
      intro="As pessoas que trabalham na sua agência dentro da Tivvo e o que cada uma pode fazer."
    >
      <DocFigure
        src="/docs-media/pt/equipo.webp"
        alt="A equipa da agência"
        width={1304}
        height={946}
        markers={[
          { x: 61.4, y: 6, label: "Filtre por função." },
          { x: 88.1, y: 6, label: "Convidar alguém." },
          { x: 11.3, y: 19.7, label: "A função de cada pessoa." },
        ]}
      />
      <DocSteps>
        <DocStep>
          Toque em <strong>Convidar membro</strong>, escreva o nome e o email e escolha a função: administrador ou agente.
        </DocStep>
        <DocStep>
          Recebe o acesso por email. Se já tinha conta na Tivvo (por exemplo, noutra agência), juntamo-lo à sua equipa e
          entra com a palavra-passe de sempre.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/pt/equipo-invitar.webp"
        alt="O diálogo Convidar membro"
        width={784}
        height={769}
        className="max-w-md"
        markers={[{ x: 50, y: 72.7, label: "Administrador ou agente. Ver «Funções» em Primeiros passos." }]}
      />
      <DocList>
        <li>No menu ⋯ de cada pessoa pode mudar-lhe a função, copiar o email, desativar o acesso ou retirá-la da equipa.</li>
        <li>
          <strong>Desativar o acesso</strong> impede-a de entrar mas conserva o seu lugar, os seus imóveis e os seus
          clientes; pode reativá-lo quando quiser. Quem não tem acesso aparece no fim.
        </li>
        <li>
          <strong>Retirar da equipa</strong> tira-lhe o acesso a esta agência. A conta não é apagada: se pertencer a outra
          agência, continua a entrar lá.
        </li>
        <li>O titular da conta não pode ser retirado nem mudar de função.</li>
      </DocList>
    </DocSection>
  );
}

function SettingsDoc() {
  return (
    <DocSection
      id="configuracion"
      icon={Settings}
      title="Definições"
      adminOnly
      intro="Os dados da sua agência e as preferências de toda a conta."
    >
      <DocFigure
        src="/docs-media/pt/configuracion.webp"
        alt="A página Definições"
        width={1304}
        height={1486}
        markers={[
          { x: 6.1, y: 16.8, label: "O seu logótipo e o nome da agência." },
          { x: 30.4, y: 32.6, label: "O endereço do seu site." },
          { x: 30.4, y: 39.1, label: "O email que recebe os avisos de pedidos." },
          { x: 32.2, y: 51.8, label: "Se o proprietário vê a sua comissão. Guarda-se ao alterar." },
          { x: 30.4, y: 69.1, label: "Idioma e moeda por defeito." },
          { x: 90.6, y: 3.4, label: "Guardar; ao lado, atalhos para copiar, ver e personalizar o site." },
        ]}
      />
      <DocTerms
        items={[
          [
            "A sua agência",
            "O nome e o logótipo com que os seus clientes o veem. Toque no logótipo para o mudar; é carregado no momento.",
          ],
          [
            "Site público",
            "O endereço do seu site (só minúsculas, números e hífenes). Se o mudar, o link anterior deixa de funcionar: atualize-o onde o tiver partilhado. Também o email de contacto, que recebe os avisos de pedidos.",
          ],
          [
            "Portal do proprietário",
            "«Mostrar a comissão da agência»: desligado, o proprietário vê quanto lhe cabe, mas não quanto foi descontado. Guarda-se ao alterar, sem tocar em Guardar.",
          ],
          [
            "Preferências",
            "O idioma do site (os links que partilha abrem nesse idioma, e os seus clientes podem mudá-lo na página) e a moeda por defeito dos preços.",
          ],
        ]}
      />
    </DocSection>
  );
}

function Profile() {
  return (
    <DocSection
      id="perfil"
      icon={UserRound}
      title="O meu perfil"
      intro="Os seus dados pessoais dentro da conta da agência."
    >
      <DocFigure
        src="/docs-media/pt/perfil.webp"
        alt="A página O meu perfil"
        width={1304}
        height={1321}
        markers={[
          { x: 6.1, y: 18.9, label: "Toque na foto para a mudar; ao lado, a sua função." },
          { x: 30.4, y: 30.1, label: "O seu nome e email; guardam-se com «Guardar», em cima." },
          { x: 30.4, y: 53, label: "Para mudar a palavra-passe: a atual e a nova, duas vezes." },
        ]}
      />
      <DocList>
        <li>A foto é carregada no momento; o seu nome vê-se no menu e no histórico dos seus clientes.</li>
        <li>A nova palavra-passe tem de ter pelo menos 8 caracteres. O olho de cada campo mostra o que escreveu.</li>
        <li>
          O idioma do painel muda-se no menu do seu perfil, em «Idioma». É pessoal: cada pessoa da equipa pode usar o seu.
        </li>
      </DocList>
    </DocSection>
  );
}

function Shortcuts() {
  return (
    <DocSection
      id="atajos"
      icon={Keyboard}
      title="Pesquisa, atalhos e ajuda"
      intro="Para se mover por todo o painel sem largar o teclado, e a quem recorrer se ficar preso."
    >
      <DocH3>Pesquisa</DocH3>
      <DocP>
        <Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd> abre uma pesquisa que encontra páginas, imóveis, ofertas e clientes pelo nome. A
        partir daí também pode criar um imóvel, oferta, cliente ou reserva, convidar alguém para a equipa, abrir esta
        documentação, mudar a aparência, recolher o menu e terminar sessão.
      </DocP>
      <DocFigure
        src="/docs-media/pt/buscador.webp"
        alt="A pesquisa a mostrar resultados ao escrever «pérez»"
        width={960}
        height={347}
        className="max-w-lg"
        caption="Escreva parte de um nome e escolha com as setas e Enter. Esc fecha-a."
      />

      <DocH3>Atalhos</DocH3>
      <DocP>
        <Kbd>?</Kbd> mostra todos os atalhos em qualquer ecrã do painel.
      </DocP>
      <DocTerms
        items={[
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd></>, "Pesquisar e executar comandos"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd></>, "Guardar o formulário aberto"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd></>, "Recolher ou expandir o menu lateral"],
          [<Kbd key="q">?</Kbd>, "Ver todos os atalhos"],
          [
            <><Kbd>G</Kbd> e uma letra</>,
            "Ir a uma secção: P imóveis, O ofertas, C clientes, I pedidos, R reservas, D disponibilidade, E equipa, W site, S definições, M o meu perfil",
          ],
          [<Kbd key="n">N</Kbd>, "Criar um novo na lista aberta"],
          [<Kbd key="s">/</Kbd>, "Ir para a pesquisa da lista"],
          [<Kbd key="f">F</Kbd>, "Abrir os filtros"],
          [<><Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd></>, "Vista grelha, lista ou tabela"],
          [<><Kbd>J</Kbd> <Kbd>K</Kbd></>, "Descer e subir entre elementos; Enter abre o selecionado"],
          [<Kbd key="e">Esc</Kbd>, "Limpar a seleção"],
        ]}
      />

      <DocH3>Ajuda e suporte</DocH3>
      <DocP>
        No menu do seu perfil, <strong>Ajuda e suporte</strong> abre o centro de ajuda: perguntas frequentes com pesquisa e
        um formulário para escrever à equipa da Tivvo. Respondemos por email.
      </DocP>
      <DocFigure
        src="/docs-media/pt/ayuda.webp"
        alt="O centro de ajuda da Tivvo"
        width={1584}
        height={946}
        caption="Pesquise a sua dúvida; se não a encontrar, escreva-nos pelo formulário."
      />
    </DocSection>
  );
}

export const DOC_SECTIONS: DocEntry[] = [
  { id: "primeros-pasos", label: "Primeiros passos", Content: Basics },
  { id: "consultas", label: "Pedidos", Content: Inquiries },
  { id: "clientes", label: "Clientes", Content: Clients },
  { id: "propiedades", label: "Imóveis", Content: Properties },
  { id: "propietarios", label: "Proprietários", Content: Owners },
  { id: "importar", label: "Importar imóveis", adminOnly: true, Content: Importer },
  { id: "ofertas", label: "Ofertas", Content: Offers },
  { id: "reservas", label: "Reservas", Content: Bookings },
  { id: "disponibilidad", label: "Disponibilidade", Content: Availability },
  { id: "servicios", label: "Serviços", Content: Services },
  { id: "portal", label: "Site", adminOnly: true, Content: Portal },
  { id: "lo-que-ven-tus-clientes", label: "O que veem os seus clientes", Content: ClientPages },
  { id: "equipo", label: "Equipa", adminOnly: true, Content: Team },
  { id: "configuracion", label: "Definições", adminOnly: true, Content: SettingsDoc },
  { id: "perfil", label: "O meu perfil", Content: Profile },
  { id: "atajos", label: "Pesquisa, atalhos e ajuda", Content: Shortcuts },
];
