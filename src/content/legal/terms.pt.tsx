import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, jurisdiction, contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "A Tivvu é uma ferramenta para a sua agência gerir imóveis, clientes, ofertas e reservas, e publicar o seu próprio site. Não somos parte nas operações que faz com os seus clientes.",
  "Os dados que regista são da sua agência. Nós guardamo-los e tratamo-los para lhe prestar o serviço, e pode exportá-los.",
  "A sua agência é responsável por cumprir as normas da sua atividade: licença, publicidade verdadeira, contratos de arrendamento e proteção de dados dos seus clientes.",
  "Pode cancelar o seu plano quando quiser, pelo mesmo meio em que o contratou. Avisamos com 30 dias de antecedência se os preços ou estas condições mudarem.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "quienes-somos",
    title: "Quem somos e o que regulam estes termos",
    brief:
      "Estes Termos, a Política de privacidade e as condições do seu plano formam o acordo completo entre a Tivvu e a sua agência.",
    content: (
      <>
        <p>
          Estes Termos e condições (os «Termos») regulam o acesso e a utilização
          da Tivvu, o sistema de gestão para agências imobiliárias disponível em
          tivvu.app e nos seus subdomínios (o «Serviço»). O Serviço é prestado
          por {name}, CUIT {taxId}, com morada em {address} («Tivvu», «nós»).
        </p>
        <p>
          Os Termos formam, juntamente com a{" "}
          <LegalLink href="/privacy">Política de privacidade</LegalLink> e as
          condições do plano que contratar, o acordo completo entre a Tivvu e a
          Agência. Se uma condição particular do seu plano (por exemplo, um
          acordo Enterprise assinado) disser algo diferente, prevalece a
          condição particular.
        </p>
      </>
    ),
  },
  {
    id: "definiciones",
    title: "Definições",
    brief:
      "A Agência é quem abre a conta, os Utilizadores são quem trabalha nela e os Clientes finais são as pessoas cujos dados são registados.",
    content: (
      <ul>
        <li>
          <strong>Agência:</strong> a pessoa singular ou coletiva que cria uma
          conta na Tivvu para gerir a sua atividade imobiliária.
        </li>
        <li>
          <strong>Utilizadores:</strong> as pessoas que a Agência autoriza a
          usar a sua conta (titulares, administradores, agentes e outras
          funções).
        </li>
        <li>
          <strong>Clientes finais:</strong> as pessoas cujos dados a Agência
          regista ou recebe através do Serviço: interessados, compradores,
          inquilinos, hóspedes e proprietários.
        </li>
        <li>
          <strong>Dados da Agência:</strong> toda a informação que a Agência e
          os seus Utilizadores registam no Serviço ou recebem através dele:
          imóveis, fotos, textos, tarifas, clientes, pedidos, ofertas, reservas,
          pagamentos registados e documentos.
        </li>
        <li>
          <strong>Site da Agência:</strong> o site público que a Agência monta
          com o editor da Tivvu e que é publicado num subdomínio da Tivvu com o
          nome da Agência.
        </li>
      </ul>
    ),
  },
  {
    id: "aceptacion",
    title: "Aceitação e capacidade",
    brief:
      "Ao usar a Tivvu aceita estes Termos. Tem de ser maior de 18 anos e ter capacidade para contratar.",
    content: (
      <>
        <p>
          Ao criar uma conta, entrar com Google ou Apple, ou usar o Serviço,
          aceita estes Termos. Se não concordar, não use o Serviço.
        </p>
        <p>
          Para criar uma conta tem de ser maior de 18 anos e ter capacidade para
          contratar. Se a criar em nome de uma empresa ou de outra pessoa,
          declara que tem poderes suficientes para a vincular; nesse caso, «você»
          e «a Agência» referem-se a essa empresa ou pessoa.
        </p>
        <p>
          Estes Termos são um contrato de adesão nos termos dos artigos 984 e
          seguintes do Código Civil e Comercial da Nação argentina. Redigimo-los
          para que se entendam sem ajuda; se algo não ficar claro, escreva-nos
          antes de os aceitar.
        </p>
      </>
    ),
  },
  {
    id: "cuenta",
    title: "Conta, utilizadores e segurança",
    brief:
      "Mantenha os seus dados atualizados, não partilhe palavras-passe e avise-nos se suspeitar que alguém entrou na sua conta.",
    content: (
      <>
        <p>
          A Agência tem de fornecer informação verdadeira e mantê-la atualizada,
          em especial o email de contacto, porque é o meio pelo qual o avisamos
          de alterações importantes.
        </p>
        <p>
          A Agência decide quem acede à sua conta e com que permissões, e
          responde pelo que os seus Utilizadores fizerem dentro do Serviço. Cada
          Utilizador deve ter credenciais próprias: não partilhe palavras-passe
          entre pessoas.
        </p>
        <p>
          Se suspeitar que alguém acedeu à sua conta sem autorização, mude a
          palavra-passe e avise-nos de imediato em{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "servicio",
    title: "O que o Serviço inclui",
    brief:
      "O que pode fazer depende do seu plano. Podemos alterar funcionalidades; se retirarmos uma essencial de um plano pago, avisamos com 30 dias de antecedência.",
    content: (
      <>
        <p>Consoante o plano contratado, o Serviço permite, entre outras coisas:</p>
        <ul>
          <li>registar e publicar imóveis para venda e arrendamento de curta duração;</li>
          <li>
            gerir clientes, pedidos, ofertas, reservas, disponibilidade, tarifas
            por época e pagamentos registados;
          </li>
          <li>
            partilhar ofertas, reservas e o portal do proprietário através de
            links privados;
          </li>
          <li>montar e publicar o Site da Agência;</li>
          <li>trabalhar em equipa com funções e permissões.</li>
        </ul>
        <p>
          A Tivvu melhora o Serviço continuamente: podemos acrescentar, alterar
          ou retirar funcionalidades. Se retirarmos uma funcionalidade essencial
          de um plano pago, avisamos com pelo menos 30 dias de antecedência e, se
          a alteração não lhe servir, pode cancelar o plano sem custos.
        </p>
        <p>
          Algumas funcionalidades podem ser oferecidas como «beta» ou de teste.
          São prestadas tal como estão, podem mudar sem aviso e não convém
          depender delas para tarefas críticas.
        </p>
      </>
    ),
  },
  {
    id: "rol-de-tivvu",
    title: "A Tivvu não é parte nas suas operações",
    brief:
      "A Tivvu é software: não é imobiliária nem intermediária, e não processa nem guarda os seus pagamentos.",
    content: (
      <>
        <p>
          A Tivvu é uma ferramenta de software. Não é uma imobiliária, não atua
          como mediadora nem intermediária, não cobra em nome da Agência e não
          garante que uma operação se concretize. As vendas, arrendamentos,
          reservas, sinais, comissões e cobranças são acordos entre a Agência,
          os seus clientes e os proprietários.
        </p>
        <p>
          Os pagamentos que a Agência regista na Tivvu são anotações para o seu
          próprio controlo; a Tivvu não os processa nem os guarda. As
          disponibilidades sincronizadas com calendários externos (por exemplo,
          por iCal) dependem desses serviços e podem ter atrasos: a Agência deve
          confirmar a disponibilidade antes de fechar uma reserva.
        </p>
      </>
    ),
  },
  {
    id: "obligaciones-agencia",
    title: "Responsabilidades da Agência",
    brief:
      "A sua agência responde pela sua licença, pela veracidade dos seus anúncios, pelos seus contratos, pelos dados dos seus clientes e pelos seus impostos.",
    content: (
      <>
        <p>
          A Agência é a única responsável pela sua atividade e, em particular,
          por:
        </p>
        <ul>
          <li>
            cumprir as normas de mediação imobiliária que lhe sejam aplicáveis
            (licença, ordem profissional e leis de cada jurisdição onde opera);
          </li>
          <li>
            que a informação dos seus imóveis, preços e condições seja
            verdadeira, completa e atualizada, como exige a lei de defesa do
            consumidor (na Argentina, a Lei 24.240);
          </li>
          <li>
            os contratos que celebre com os seus clientes e proprietários,
            incluindo as normas sobre arrendamentos e alojamento de curta
            duração;
          </li>
          <li>
            tratar os dados pessoais dos seus Clientes finais de acordo com a lei
            aplicável (na Argentina, a Lei 25.326; ver a secção «Dados da
            Agência e dados pessoais»);
          </li>
          <li>
            ter os direitos sobre as fotos, plantas, textos e marcas que publica,
            e a autorização dos proprietários para publicar os seus imóveis;
          </li>
          <li>os impostos e obrigações fiscais decorrentes da sua atividade.</li>
        </ul>
      </>
    ),
  },
  {
    id: "uso-aceptable",
    title: "Utilização aceitável",
    brief:
      "Nada de anúncios falsos, spam, dados sensíveis desnecessários, scraping ou tentativas de entrar em contas alheias.",
    content: (
      <>
        <p>Não é permitido usar o Serviço para:</p>
        <ul>
          <li>publicar imóveis inexistentes, preços enganosos ou conteúdo ilícito;</li>
          <li>
            enviar comunicações comerciais não solicitadas ou usar dados de
            contacto obtidos sem base legal;
          </li>
          <li>
            registar dados sensíveis (saúde, origem racial ou étnica, opiniões
            políticas, convicções religiosas, vida sexual), salvo se a lei o
            permitir e for indispensável;
          </li>
          <li>
            infringir direitos de propriedade intelectual, de imagem ou de
            privacidade de terceiros;
          </li>
          <li>
            tentar aceder a contas ou dados de outras agências, testar
            vulnerabilidades sem autorização, sobrecarregar a infraestrutura ou
            distribuir software malicioso;
          </li>
          <li>
            copiar o Serviço de forma automatizada (scraping), fazer engenharia
            inversa ou revendê-lo sem um acordo escrito com a Tivvu.
          </li>
        </ul>
        <p>
          Se encontrar uma vulnerabilidade, conte-nos em{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>:
          analisamo-la e respondemos.
        </p>
      </>
    ),
  },
  {
    id: "planes-y-pagos",
    title: "Planos, preços e pagamentos",
    brief:
      "Fatura-se antecipadamente e renova-se automaticamente. Avisamos com 30 dias de antecedência antes de mudar preços; se um pagamento falhar, tem 15 dias para o regularizar.",
    content: (
      <>
        <p>
          A Tivvu oferece um plano gratuito com limites (por exemplo, número de
          imóveis e de Utilizadores) e planos pagos. Os preços, limites e
          funcionalidades em vigor de cada plano são publicados em{" "}
          <LegalLink href="/#planes">tivvu.app</LegalLink> ou acordados por
          escrito no caso de planos à medida.
        </p>
        <ul>
          <li>
            Os planos pagos são faturados antecipadamente, mensalmente (ou no
            período acordado), e renovam-se automaticamente até a Agência os
            cancelar.
          </li>
          <li>
            Os preços publicados em dólares americanos podem ser pagos em pesos
            argentinos à taxa de câmbio indicada no momento do pagamento. Os
            impostos aplicáveis acrescem ao preço, salvo indicação em contrário.
          </li>
          <li>
            Se alterarmos o preço do seu plano, avisamos por email com pelo menos
            30 dias de antecedência. O novo preço aplica-se a partir do período
            seguinte ao aviso; se não concordar, pode cancelar o plano antes de
            entrar em vigor.
          </li>
          <li>
            Se um pagamento não for creditado, avisamos e tem 15 dias seguidos
            para o regularizar. Passado esse prazo, podemos passar a conta para
            o plano gratuito ou suspendê-la. Os seus dados não são apagados pela
            suspensão.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "baja",
    title: "Cancelamento e direito de livre resolução",
    brief:
      "Pode cancelar quando quiser. Produz efeito no fim do período pago e não há reembolso proporcional, salvo se a lei dispuser outra coisa.",
    content: (
      <>
        <p>
          A Agência pode cancelar o seu plano a qualquer momento, sem explicar o
          motivo e sem penalização, pelo mesmo meio em que o contratou ou
          escrevendo para{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
          No prazo de 24 horas enviamos-lhe, pelo mesmo meio, um código que
          identifica o seu pedido de cancelamento.
        </p>
        <p>
          O cancelamento produz efeito no fim do período já pago: até lá
          continua a ter acesso ao plano. Não fazemos reembolsos proporcionais de
          períodos já iniciados, salvo se a lei dispuser o contrário.
        </p>
        <p>
          Se contratar como consumidor nos termos da Lei argentina 24.240, pode
          revogar a contratação no prazo de 10 dias seguidos a contar da data em
          que a fez (artigo 34 dessa lei e artigo 1110 do Código Civil e
          Comercial), sem custos nem responsabilidade, e reembolsamos o que
          tiver pago. Este direito não se aplica quando o Serviço é contratado
          para ser integrado numa atividade comercial ou profissional, que é a
          utilização habitual de uma agência.
        </p>
      </>
    ),
  },
  {
    id: "datos-personales",
    title: "Dados da Agência e dados pessoais",
    brief:
      "Os dados são da sua agência e não os vendemos. Pelos dados dos seus clientes responde você; nós tratamo-los por sua conta.",
    content: (
      <>
        <p>
          Os Dados da Agência são da Agência. A Tivvu usa-os apenas para
          prestar, manter e melhorar o Serviço, dar-lhe suporte e cumprir a lei;
          não os vende nem os usa para contactar os seus clientes por conta
          própria.
        </p>
        <p>
          Quanto aos dados pessoais dos Clientes finais, a Agência é a
          responsável pela base de dados e a Tivvu atua como prestadora de
          serviços de tratamento por sua conta, nos termos do artigo 25 da Lei
          argentina 25.326. Em consequência, a Tivvu:
        </p>
        <ul>
          <li>
            trata esses dados apenas para prestar o Serviço e segundo as
            instruções da Agência, que decorrem destes Termos e da forma como
            configura e usa o Serviço;
          </li>
          <li>
            não os cede a terceiros, salvo aos fornecedores de que necessita para
            operar ou quando uma autoridade o ordene;
          </li>
          <li>
            aplica medidas de segurança técnicas e organizativas e exige
            confidencialidade ao seu pessoal e fornecedores;
          </li>
          <li>
            avisa a Agência sem demora injustificada se detetar um incidente de
            segurança que afete os seus dados;
          </li>
          <li>
            colabora com a Agência para responder aos pedidos de acesso,
            retificação ou supressão dos Clientes finais;
          </li>
          <li>
            no fim do Serviço, elimina esses dados nos prazos da secção
            «Exportação e eliminação de dados».
          </li>
        </ul>
        <p>
          A Agência, por sua vez, garante que tem base legal para registar esses
          dados e que informa os seus Clientes finais sobre como os trata. A{" "}
          <LegalLink href="/privacy">Política de privacidade</LegalLink> explica
          que dados a Tivvu trata, com que fornecedores e em que países.
        </p>
      </>
    ),
  },
  {
    id: "contenido",
    title: "Conteúdo da Agência e licença",
    brief:
      "O seu conteúdo continua a ser seu; apenas nos dá autorização para o alojar e mostrar enquanto usar o Serviço.",
    content: (
      <>
        <p>
          A Agência conserva todos os seus direitos sobre as fotos, textos,
          logótipos e demais conteúdo que carrega. Concede-nos uma licença não
          exclusiva, gratuita e limitada à vigência do Serviço para alojar,
          copiar, adaptar (por exemplo, reduzir o tamanho das imagens) e mostrar
          esse conteúdo, unicamente para prestar o Serviço e publicar o Site da
          Agência.
        </p>
        <p>
          Se recebermos uma reclamação fundamentada de que um conteúdo infringe
          direitos de terceiros, podemos retirá-lo e informá-lo-emos.
        </p>
      </>
    ),
  },
  {
    id: "sitio-y-links",
    title: "Site da Agência e links partilhados",
    brief:
      "O site é da sua agência. Os links privados abrem-se por quem os tiver: envie-os só a quem corresponde.",
    content: (
      <>
        <p>
          O Site da Agência é da Agência: ela decide o que publica e é
          responsável pelo seu conteúdo. Os pedidos que chegam pelo site, pelas
          fichas de imóvel ou pelas ofertas ficam guardados na conta da Agência,
          e a Tivvu envia os emails de aviso e de confirmação em seu nome.
        </p>
        <p>
          As ofertas, reservas e o portal do proprietário partilham-se através
          de links privados difíceis de adivinhar. Qualquer pessoa que tenha o
          link pode ver o seu conteúdo, por isso a Agência deve enviá-los apenas
          à pessoa a quem se destinam.
        </p>
        <p>
          Atualmente o Site da Agência é publicado num subdomínio da Tivvu. Se a
          Agência deixar o Serviço, o site deixa de estar disponível.
        </p>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    title: "Propriedade intelectual da Tivvu",
    brief:
      "O software e a marca Tivvu são nossos; pode usá-los enquanto a sua conta estiver ativa.",
    content: (
      <p>
        O software, o design, os modelos do site, a marca Tivvu e o seu logótipo
        são da Tivvu ou dos seus licenciantes. Estes Termos não lhe transferem
        qualquer direito sobre eles, para além da autorização para usar o
        Serviço enquanto a sua conta estiver ativa. Se nos enviar ideias ou
        sugestões, podemos usá-las livremente para melhorar o Serviço, sem
        obrigação de o compensar.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "Serviços de terceiros",
    brief:
      "Google, Apple e os calendários externos regem-se pelas suas próprias condições, e não respondemos por eles.",
    content: (
      <p>
        O Serviço integra-se com serviços de terceiros, como o início de sessão
        com Google ou Apple, ou a sincronização de calendários de plataformas de
        arrendamento. Esses serviços regem-se pelos seus próprios termos e
        políticas, e a Tivvu não responde pelo seu funcionamento nem pelas
        alterações que façam às suas condições.
      </p>
    ),
  },
  {
    id: "disponibilidad",
    title: "Disponibilidade e suporte",
    brief:
      "Fazemos o razoável para que funcione bem, sem garantir zero interrupções. Suporte por email em dias úteis.",
    content: (
      <>
        <p>
          Fazemos esforços razoáveis para que o Serviço esteja disponível e
          funcione bem, mas não podemos garantir que não tenha interrupções ou
          erros. Sempre que possível, programamos as manutenções em horários de
          pouca utilização e anunciamo-las com antecedência.
        </p>
        <p>
          Atendemos questões e reclamações por email em{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>,
          nos dias úteis de segunda a sexta-feira. Os compromissos de
          disponibilidade ou de tempos de resposta (acordos de nível de serviço)
          só existem se forem acordados por escrito, por exemplo num plano
          Enterprise.
        </p>
      </>
    ),
  },
  {
    id: "exportacion",
    title: "Exportação e eliminação de dados",
    brief:
      "O que apaga vai para o lixo durante 30 dias. Se fechar a conta, tem 30 dias para exportar os seus dados.",
    content: (
      <>
        <p>
          O que se elimina dentro do Serviço vai para o lixo, onde pode ser
          recuperado durante 30 dias; depois é apagado definitivamente.
        </p>
        <p>
          Se a Agência cancelar a sua conta ou a conta for fechada por qualquer
          motivo, os Dados da Agência ficam disponíveis para exportar durante 30
          dias. Passado esse prazo eliminamo-los dos nossos sistemas ativos, e as
          cópias de segurança são sobrescritas no seu ciclo normal, que não
          ultrapassa 90 dias. Só conservamos por mais tempo o que a lei nos
          obriga a guardar (por exemplo, registos de faturação) ou, até um máximo
          de dois anos, o que a Agência nos autorize expressamente a conservar,
          como permite o artigo 25 da Lei argentina 25.326.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspensão e cessação por parte da Tivvu",
    brief:
      "Podemos suspender uma conta por incumprimentos graves ou risco de segurança, avisando antes salvo urgência.",
    content: (
      <>
        <p>
          Podemos suspender ou fechar uma conta se a Agência incumprir
          gravemente estes Termos, se o uso da conta puser em risco a segurança
          do Serviço ou de outras agências, ou se uma autoridade competente o
          ordenar. Salvo urgência ou impedimento legal, avisamos antes e damos um
          prazo razoável para corrigir o problema.
        </p>
        <p>
          Também podemos deixar de prestar o Serviço em geral, avisando com pelo
          menos 90 dias de antecedência e reembolsando a parte proporcional do
          que tiver pago antecipadamente.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Limitação de responsabilidade",
    brief:
      "Não respondemos por lucros cessantes nem pelas suas operações; o limite é o que pagou nos últimos 12 meses, com as exceções previstas na lei.",
    content: (
      <>
        <p>
          Na medida em que a lei o permita, a Tivvu não responde por lucros
          cessantes, perda de oportunidades comerciais nem danos indiretos
          decorrentes do uso ou da impossibilidade de usar o Serviço, nem pelas
          operações entre a Agência, os seus clientes e os proprietários.
        </p>
        <p>
          A responsabilidade total da Tivvu perante a Agência por qualquer
          reclamação relacionada com o Serviço limita-se ao montante que a
          Agência tenha pago à Tivvu nos 12 meses anteriores ao facto que
          origina a reclamação.
        </p>
        <p>
          Estes limites não se aplicam em caso de dolo ou culpa grave da Tivvu,
          nem limitam os direitos que as normas de ordem pública, como a Lei
          argentina 24.240, reconhecem aos consumidores.
        </p>
      </>
    ),
  },
  {
    id: "indemnidad",
    title: "Indemnização",
    brief:
      "Se um terceiro reclamar pelo que publica ou pelas suas operações, a sua agência assume a responsabilidade.",
    content: (
      <p>
        A Agência manterá a Tivvu indemne perante reclamações de terceiros
        (incluindo Clientes finais, proprietários e autoridades) decorrentes do
        conteúdo que publica, das operações que realiza ou do incumprimento
        destes Termos ou da regulamentação aplicável à sua atividade, incluindo
        as despesas razoáveis de defesa.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Alterações a estes Termos",
    brief:
      "Avisamos as alterações relevantes com 30 dias de antecedência, e pode cancelar antes de entrarem em vigor.",
    content: (
      <>
        <p>
          Podemos atualizar estes Termos. Se a alteração for relevante, avisamos
          por email e dentro do Serviço com pelo menos 30 dias de antecedência
          em relação à entrada em vigor. As alterações exigidas por lei ou que
          apenas o beneficiem podem aplicar-se antes.
        </p>
        <p>
          Se não concordar com a nova versão, pode cancelar a sua conta antes de
          entrar em vigor. Se continuar a usar o Serviço depois, entende-se que a
          aceita. A data da versão em vigor figura no início desta página.
        </p>
      </>
    ),
  },
  {
    id: "ley-aplicable",
    title: "Lei aplicável e jurisdição",
    brief:
      "Aplica-se a lei argentina. Primeiro tentamos resolver a falar; se for consumidor, pode reclamar no seu domicílio.",
    content: (
      <>
        <p>
          Estes Termos regem-se pelas leis da República Argentina. Perante
          qualquer divergência, tentaremos primeiro resolvê-la de boa-fé;
          escreva-nos para{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
        <p>
          Se não houver acordo, serão competentes os tribunais comuns de{" "}
          {jurisdiction}. Se contratou como consumidor, pode apresentar a sua
          reclamação nos tribunais do seu domicílio e junto das autoridades de
          defesa do consumidor (a nível nacional na Argentina, através de{" "}
          <LegalLink href="https://www.argentina.gob.ar/produccion/defensadelconsumidor">
            argentina.gob.ar/defensadelconsumidor
          </LegalLink>
          ).
        </p>
      </>
    ),
  },
  {
    id: "contacto",
    title: "Contacto",
    content: (
      <p>
        Para qualquer questão sobre estes Termos escreva-nos para{" "}
        <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        Sede: {address}.
      </p>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Termos e condições",
  metaDescription:
    "Condições de utilização da Tivvu, o sistema de gestão para agências de venda e arrendamento de curta duração.",
  title: "Termos e condições",
  intro: (
    <>
      <p>
        As regras para usar a Tivvu: o que fazemos nós, o que cabe à sua
        agência e o que acontece aos seus dados, aos seus pagamentos e à sua
        conta.
      </p>
      <p>
        Esta tradução é fornecida por conveniência. Em caso de divergência,
        prevalece a versão em espanhol.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/privacy", label: "Política de privacidade" },
};
