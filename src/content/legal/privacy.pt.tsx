import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LegalTable } from "@/components/legal/legal-table";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, privacyEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Usamos os seus dados para lhe prestar o serviço, cobrá-lo, mantê-lo seguro e avisá-lo do que é importante. Não vendemos dados nem mostramos publicidade.",
  "Os dados dos clientes e proprietários que uma agência regista são dessa agência: ela decide como os usa e nós tratamo-los por sua conta.",
  "Trabalhamos com fornecedores de infraestrutura e de email que podem estar fora da Argentina, com contratos que protegem os seus dados.",
  "Pode pedir-nos acesso, retificação ou eliminação dos seus dados escrevendo para " +
    privacyEmail +
    ". O acesso é gratuito.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "responsable",
    title: "Quem é responsável pelos seus dados",
    brief:
      "Pelos dados da sua agência e de quem nos visita somos responsáveis nós; pelos dos seus clientes, é a agência, e nós tratamo-los por sua conta.",
    content: (
      <>
        <p>
          Esta Política explica como {name}, CUIT {taxId}, com morada em{" "}
          {address} («Tivvo», «nós»), trata dados pessoais quando usa
          tivvo.app, os seus subdomínios e os sites de agências publicados com a
          Tivvo. Aplica-se de acordo com a Lei argentina 25.326 de Proteção dos
          Dados Pessoais, o seu Decreto regulamentar 1558/2001 e as normas da
          Agência de Acesso à Informação Pública (AAIP).
        </p>
        <p>A Tivvo tem dois papéis distintos consoante de quem são os dados:</p>
        <ul>
          <li>
            <strong>Somos responsáveis</strong> pelos dados das agências e dos
            seus utilizadores (conta, faturação, uso do sistema), de quem pede
            uma demonstração ou nos escreve, e de quem visita tivvo.app.
          </li>
          <li>
            <strong>Tratamos dados por conta de cada agência</strong> quando se
            trata dos seus clientes, interessados, hóspedes e proprietários.
            Nesse caso a responsável é a agência, e nós atuamos como prestador
            de serviços de tratamento (artigo 25 da Lei 25.326): seguimos as
            suas instruções e não usamos esses dados para fins próprios.
          </li>
        </ul>
        <p>
          Se deixou os seus dados no site de uma agência, recebeu uma oferta ou
          tem uma reserva, quem decide sobre os seus dados é essa agência.
          Convém escrever-lhe primeiro a ela; se nos escrever a nós,
          encaminhamos-lhe o seu pedido.
        </p>
      </>
    ),
  },
  {
    id: "datos-que-tratamos",
    title: "Que dados tratamos",
    brief:
      "Conta, acesso, dados técnicos e comunicações; e, por conta de cada agência, os dados dos seus clientes. Não pedimos dados sensíveis.",
    content: (
      <>
        <h3>Se usa a Tivvo numa agência</h3>
        <ul>
          <li>
            <strong>Conta:</strong> nome, email, palavra-passe (guardada cifrada
            com um algoritmo de hash, nunca em texto simples), função e agência
            a que pertence.
          </li>
          <li>
            <strong>Acesso com Google ou Apple:</strong> se o escolher,
            recebemos desse fornecedor o seu nome, o seu email e um
            identificador de conta. Não recebemos a sua palavra-passe.
          </li>
          <li>
            <strong>Agência:</strong> nome, dados de contacto, logótipo,
            configuração do site e, nos planos pagos, os dados necessários para
            faturar.
          </li>
          <li>
            <strong>Uso e dados técnicos:</strong> datas de acesso, ações
            relevantes dentro do sistema, endereço IP, navegador e registos de
            erros, que usamos para segurança e para resolver problemas.
          </li>
          <li>
            <strong>Comunicações:</strong> o que nos escreve por email ou no
            formulário de demonstração (nome, email, agência, tamanho da equipa e
            a sua mensagem).
          </li>
        </ul>
        <h3>Dados que as agências registam ou recebem com a Tivvo</h3>
        <p>
          Por conta de cada agência tratamos os dados dos seus clientes finais:
          nome, email, telefone, pedidos e mensagens, notas e histórico, ofertas,
          reservas com datas e número de hóspedes, pagamentos registados,
          documentos que a agência anexe e dados dos proprietários e dos seus
          imóveis. Os dados registados dependem de cada agência.
        </p>
        <p>
          Não pedimos dados sensíveis e pedimos às agências que não os registem,
          salvo se a lei o permitir e for indispensável.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Para que os usamos",
    brief:
      "Para lhe prestar o serviço, cobrá-lo, mantê-lo seguro e avisá-lo do que é importante. Não vendemos dados nem fazemos publicidade de terceiros.",
    content: (
      <>
        <p>Usamos os dados pelos quais somos responsáveis para:</p>
        <ol>
          <li>
            criar e administrar a sua conta e a da sua agência, e permitir-lhe
            entrar;
          </li>
          <li>prestar o Serviço que contratou, com as suas funcionalidades e limites;</li>
          <li>faturar e cobrar os planos pagos;</li>
          <li>
            enviar-lhe avisos operacionais: segurança, alterações de
            palavra-passe, novos pedidos, alterações aos planos ou a estas
            condições;
          </li>
          <li>dar-lhe suporte e responder às suas questões ou ao seu pedido de demonstração;</li>
          <li>proteger o Serviço, detetar abusos e prevenir fraudes;</li>
          <li>
            perceber como se usa o Serviço para o melhorar, com dados agregados
            sempre que possível;
          </li>
          <li>
            enviar-lhe novidades do produto, se não se tiver oposto (pode
            cancelar a subscrição a partir de qualquer email);
          </li>
          <li>cumprir obrigações legais, contabilísticas e fiscais.</li>
        </ol>
        <p>
          Os dados dos clientes finais usamo-los apenas para que a agência possa
          trabalhar com eles: guardá-los, mostrá-los à sua equipa, publicar as
          suas ofertas ou reservas em links privados e enviar, em nome da
          agência, os emails de aviso e confirmação de pedidos, ofertas e
          reservas.
        </p>
        <p>
          Não vendemos dados pessoais, não os usamos para publicidade de
          terceiros e não tomamos decisões automatizadas que produzam efeitos
          jurídicos sobre as pessoas.
        </p>
      </>
    ),
  },
  {
    id: "bases",
    title: "Porque podemos tratá-los",
    brief:
      "Contrato, o seu consentimento ou uma obrigação legal. Os dados obrigatórios de cada formulário são os que o serviço necessita.",
    content: (
      <>
        <p>
          Tratamos os seus dados porque são necessários para a relação
          contratual com a sua agência (artigo 5.º, n.º 2, alínea c) da Lei
          25.326), porque nos deu o seu consentimento (por exemplo, ao enviar o
          formulário de demonstração), ou porque uma norma nos obriga a
          conservá-los (por exemplo, os registos de faturação).
        </p>
        <p>
          Os dados marcados como obrigatórios em cada formulário são necessários
          para prestar o Serviço: se não os fornecer, não podemos criar a conta
          nem responder ao seu pedido. Os restantes são opcionais.
        </p>
        <p>
          Quando tratamos dados por conta de uma agência, é essa agência que deve
          ter uma base legal e o consentimento dos seus clientes quando
          aplicável.
        </p>
      </>
    ),
  },
  {
    id: "proveedores",
    title: "Com quem os partilhamos",
    brief:
      "Apenas com os fornecedores de que precisamos para operar, ao abrigo de contratos que protegem os seus dados.",
    content: (
      <>
        <p>
          Partilhamos dados apenas com fornecedores de que precisamos para
          operar o Serviço, ao abrigo de contratos que lhes exigem
          confidencialidade, segurança e que os usem apenas para nos prestar o
          serviço:
        </p>
        <LegalTable
          columns={["Fornecedor", "Para que o usamos"]}
          rows={[
            [
              "Supabase (sobre infraestrutura da Amazon Web Services)",
              "Base de dados e armazenamento de fotos e ficheiros.",
            ],
            [
              "Resend",
              "Envio dos emails do sistema: avisos, confirmações e recuperação de palavra-passe.",
            ],
            [
              "Fornecedores de alojamento da aplicação web",
              "Servem as páginas e recebem os dados técnicos de cada visita (endereço IP, navegador).",
            ],
            ["Google e Apple", "Só se escolher entrar com a sua conta."],
          ]}
        />
        <p>
          Além disso, os dados mostram-se a quem corresponda segundo a forma
          como usa o Serviço: a equipa da sua agência vê os dados da agência, e
          quem recebe um link de oferta, reserva ou portal do proprietário vê o
          conteúdo desse link.
        </p>
        <p>
          Podemos revelar dados se um juiz ou uma autoridade competente o
          ordenar, ou se for necessário para defender os nossos direitos. Se a
          Tivvo se fundir ou for adquirida, os dados serão transferidos para a
          nova entidade, que deverá respeitar esta Política.
        </p>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "Transferências internacionais",
    brief:
      "Alguns fornecedores estão fora da Argentina; as transferências fazem-se com garantias equivalentes às da lei.",
    content: (
      <>
        <p>
          Alguns dos nossos fornecedores alojam ou tratam dados fora da
          Argentina, entre outros nos Estados Unidos e na União Europeia. A
          União Europeia é reconhecida pela AAIP como destino com nível de
          proteção adequado; para os restantes países, as transferências fazem-se
          ao abrigo de cláusulas contratuais que oferecem garantias equivalentes
          às da Lei 25.326, em linha com os modelos aprovados pela Disposição
          60-E/2016 e pela Resolução 198/2023 da AAIP.
        </p>
        <p>
          Ao usar o Serviço, e nos termos do artigo 12 da Lei 25.326, dá o seu
          consentimento a estas transferências. Se quiser saber mais sobre as
          garantias que aplicamos, escreva-nos.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    title: "Durante quanto tempo os guardamos",
    brief:
      "Cada dado tem o seu prazo: de 30 dias no lixo a 10 anos na faturação.",
    content: (
      <LegalTable
        columns={["Que dados", "Durante quanto tempo os guardamos"]}
        rows={[
          [
            "Dados da conta e da agência",
            "Enquanto a conta estiver ativa. Se for fechada, ficam 30 dias disponíveis para exportar e depois são eliminados; as cópias de segurança são sobrescritas num prazo que não ultrapassa 90 dias.",
          ],
          [
            "Elementos eliminados dentro do sistema",
            "30 dias no lixo, onde podem ser recuperados; depois são apagados definitivamente.",
          ],
          [
            "Dados de faturação",
            "10 anos, como exige o artigo 328 do Código Civil e Comercial argentino para a documentação contabilística.",
          ],
          [
            "Registos técnicos e de segurança",
            "O tempo necessário para investigar incidentes, em geral não mais de 12 meses.",
          ],
          [
            "Pedidos de demonstração e questões",
            "Até 2 anos desde o último contacto, ou antes se nos pedir que os apaguemos.",
          ],
        ]}
      />
    ),
  },
  {
    id: "seguridad",
    title: "Como os protegemos",
    brief:
      "Cifragem, palavras-passe com hash, dados separados por agência e permissões por função. Se houver um incidente, avisamos.",
    content: (
      <>
        <p>
          Aplicamos medidas técnicas e organizativas seguindo as recomendações
          da Resolução 47/2018 da AAIP, entre elas:
        </p>
        <ul>
          <li>
            cifragem das comunicações (HTTPS/TLS) entre o seu navegador, a
            aplicação e os nossos fornecedores;
          </li>
          <li>palavras-passe guardadas com hash, nunca legíveis;</li>
          <li>
            separação de dados por agência: cada equipa acede apenas ao seu
            próprio espaço;
          </li>
          <li>permissões por função dentro de cada agência;</li>
          <li>
            links privados de ofertas, reservas e proprietários gerados com
            identificadores difíceis de adivinhar;
          </li>
          <li>
            cópias de segurança e acesso restrito do pessoal aos dados de
            produção.
          </li>
        </ul>
        <p>
          Nenhum sistema é infalível. Se detetarmos um incidente de segurança que
          afete dados pessoais, investigamo-lo, tomamos medidas para o conter,
          comunicamo-lo às agências afetadas sem demora injustificada e, quando
          aplicável, à AAIP e às pessoas afetadas.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies e armazenamento no seu navegador",
    brief:
      "Apenas as necessárias para que o serviço funcione: sem publicidade nem rastreamento de terceiros.",
    content: (
      <>
        <p>
          A Tivvo usa apenas cookies e armazenamento local necessários para que
          o Serviço funcione. Não usamos cookies de publicidade nem de
          rastreamento de terceiros.
        </p>
        <LegalTable
          columns={["O que guarda", "Para que serve", "Quanto tempo dura"]}
          rows={[
            [
              <>
                Sessão (<code>access_token</code>, <code>refresh_token</code>,{" "}
                <code>tivvo_user</code>)
              </>,
              "Mantêm a sua sessão iniciada.",
              "Até 180 dias ou até terminar sessão.",
            ],
            [
              <>
                Preferências (<code>sidebar_collapsed</code> e armazenamento
                local)
              </>,
              "Lembram se o menu está recolhido, a vista escolhida em cada lista e o tema claro ou escuro.",
              "A cookie do menu, até 1 ano; o resto, até o apagar do seu navegador.",
            ],
            [
              "Acesso com Google ou Apple",
              "Durante o início de sessão guardamos no separador a página para onde voltar.",
              "Apaga-se ao terminar.",
            ],
          ]}
        />
        <p>
          Pode apagar ou bloquear as cookies a partir do seu navegador. Se
          bloquear as de sessão, não poderá entrar no sistema. Os sites públicos
          das agências não instalam cookies da Tivvo.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    title: "Os seus direitos e como exercê-los",
    brief:
      "Pode pedir acesso, retificação, eliminação ou que deixemos de lhe escrever; respondemos dentro dos prazos da tabela.",
    content: (
      <>
        <p>Como titular dos dados tem direito a:</p>
        <LegalTable
          columns={["Direito", "O que pode pedir", "Prazo de resposta"]}
          rows={[
            [
              "Acesso",
              "Saber que dados seus temos, de onde vieram e para que os usamos. É gratuito se o pedir com intervalos de pelo menos seis meses, salvo se demonstrar um interesse legítimo para o fazer antes (artigo 14 da Lei 25.326).",
              "10 dias seguidos",
            ],
            [
              "Retificação, atualização e supressão",
              "Que corrijamos dados inexatos ou apaguemos os que não devam ser conservados (artigo 16).",
              "5 dias úteis",
            ],
            [
              "Oposição a comunicações comerciais",
              "Pedir que deixemos de lhe enviar novidades, a qualquer momento (artigo 27).",
              "A qualquer momento",
            ],
            [
              "Revogar o seu consentimento",
              "Quando o tratamento se basear nele, sem efeito retroativo.",
              "A qualquer momento",
            ],
          ]}
        />
        <p>
          Para os exercer, escreva para{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          a partir do email associado aos seus dados, indicando o que pede. Se
          não conseguirmos verificar a sua identidade, pedir-lhe-emos um
          documento que a comprove. Também pode corrigir a maioria dos seus dados
          no seu perfil.
        </p>
        <p>
          Se os seus dados foram registados por uma agência (por exemplo, porque
          lhe fez um pedido), o pedido deve dirigir-se a essa agência; se nos
          chegar a nós, reencaminhamo-lo no prazo de 5 dias úteis e ajudamo-la a
          responder.
        </p>
        <p>
          Se não respondermos no prazo ou a resposta não o satisfizer, pode
          reclamar junto da Agência de Acesso à Informação Pública em{" "}
          <LegalLink href="https://www.argentina.gob.ar/aaip/datospersonales">
            argentina.gob.ar/aaip
          </LegalLink>
          .
        </p>
      </>
    ),
  },
  {
    id: "menores",
    title: "Menores de idade",
    brief: "A Tivvo é uma ferramenta para maiores de 18 anos.",
    content: (
      <p>
        A Tivvo é uma ferramenta profissional para maiores de 18 anos e não se
        dirige a menores. Se souber que um menor nos deu os seus dados sem
        autorização, escreva-nos e eliminamo-los.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Alterações a esta Política",
    brief: "Avisamos as alterações relevantes com 30 dias de antecedência.",
    content: (
      <p>
        Podemos atualizar esta Política para refletir alterações ao Serviço ou à
        lei. Se a alteração for relevante, avisamos por email e dentro do
        Serviço com pelo menos 30 dias de antecedência. A data da versão em
        vigor figura no início desta página.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "Contacto",
    content: (
      <>
        <p>
          Para qualquer questão sobre privacidade escreva-nos para{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          ou por correio para {address}.
        </p>
        <p className="border-l-2 border-line pl-4 text-sm text-quiet">
          A AGÊNCIA DE ACESSO À INFORMAÇÃO PÚBLICA, na qualidade de Órgão de
          Controlo da Lei n.º 25.326, tem a atribuição de atender as denúncias e
          reclamações apresentadas por quem seja afetado nos seus direitos por
          incumprimento das normas em vigor em matéria de proteção de dados
          pessoais.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Política de privacidade",
  metaDescription:
    "Que dados pessoais a Tivvo trata, para quê, com quem os partilha e como exercer os seus direitos.",
  title: "Política de privacidade",
  intro: (
    <>
      <p>
        Que dados pessoais tratamos, para quê, com quem os partilhamos e como
        pode aceder a eles, corrigi-los ou pedir que os apaguemos.
      </p>
      <p>
        Esta tradução é fornecida por conveniência. Em caso de divergência,
        prevalece a versão em espanhol.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Termos e condições" },
  action: {
    href: `mailto:${privacyEmail}?subject=${encodeURIComponent("Pedido sobre os meus dados pessoais")}`,
    label: "Exercer os meus direitos",
    hint: `Escreva-nos para ${privacyEmail}: acesso, retificação ou eliminação.`,
  },
};
