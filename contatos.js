// Catálogo telefônico — Bosque da Mata e BR Felice (Tijucas/SC)
//
// Para incluir ou corrigir um contato, edite só este arquivo.
//   n   nome do negócio ou da pessoa
//   d   detalhe opcional (quem atende, especialidade)
//   c   categorias em que aparece (precisam existir em CATEGORIAS)
//   t   telefones, só dígitos, com DDD: "48999998888"
//   confirmar  true quando o número da lista original parece incompleto
//
// Fonte: imagens do catálogo enviadas no grupo do bairro (out/2026).

window.ATUALIZADO_EM = "22/10/2026";

// Serviços públicos de Tijucas. Fonte: linktr.ee/tijucasvoluntarios (out/2026).
// "zap" é o link exato do Linktree, que já abre o WhatsApp com uma mensagem-modelo para completar.
window.UTILIDADES = [
  {
    n: "Plantão SAMAE", d: "Água e esgoto", t: "(48) 99989-2216",
    zap: "https://wa.me/5548999892216?text=Ol%C3%A1+meu+nome+%C3%A9+%2A....%2A+A+matr%C3%ADcula+do+meu+im%C3%B3vel+%C3%A9+%2A....%2A+%2C+o+endere%C3%A7o+%C3%A9+Rua+%2A...%2A+N%C3%BAmero+%2A...%2A+Bairro+%2A...%2A%2C+pr%C3%B3ximo+a+%2A...%2A+.+Preciso+de+atendimento",
  },
  {
    n: "Iluminação Pública", d: "Poste apagado ou com defeito", t: "0800 005 2019",
    zap: "https://api.whatsapp.com/send?phone=5508000052019", tel: "08000052019",
  },
  {
    n: "Alô Entulho", d: "Coleta de entulho, com agendamento", t: "(48) 99176-8316",
    zap: "https://api.whatsapp.com/send?phone=5548991768316&text=Ol%C3%A1%20meu%20nome%20%C3%A9%20...%20,%20preciso%20que%20venha%20coletar%20entulhos%20na%20Rua%20...%20N%C3%BAmero%20...,%20Bairro%20...,%20pr%C3%B3ximo%20a%20...",
  },
  {
    n: "GOR", d: "Resgate de animais", t: "(47) 99712-3641",
    zap: "https://api.whatsapp.com/send?phone=5547997123641&text=Ol%C3%A1%20meu%20nome%20%C3%A9%20...%20,%20tem%20um%20animal%20....%20na%20Rua%20...%20N%C3%BAmero%20...,%20Bairro%20...,%20pr%C3%B3ximo%20a%20...",
  },
];

window.VOLUNTARIOS = {
  instagram: "https://www.instagram.com/bosquedamatavoluntarios/",
  arroba: "@bosquedamatavoluntarios",
  linktree: "https://linktr.ee/tijucasvoluntarios",
};

// Grupos usados nos filtros rápidos. A ordem aqui é a ordem dos botões.
window.GRUPOS = [
  { id: "casa", nome: "Casa e obra" },
  { id: "comida", nome: "Comida" },
  { id: "beleza", nome: "Beleza" },
  { id: "saude", nome: "Saúde e bem-estar" },
  { id: "pets", nome: "Pets" },
  { id: "carro", nome: "Carro e transporte" },
  { id: "tec", nome: "Tecnologia" },
  { id: "prof", nome: "Profissionais" },
  { id: "compras", nome: "Compras e família" },
];

window.CATEGORIAS = {
  "Acupuntura": "saude",
  "Advogado(a)": "prof",
  "Agronomia": "prof",
  "Agropecuária": "pets",
  "Alimentação": "comida",
  "Arquitetura": "casa",
  "Artesanato": "compras",
  "Assessoria Contábil": "prof",
  "Assistência de Celulares": "tec",
  "Auto Elétrica": "carro",
  "Automação Residencial": "casa",
  "Banho e Tosa Pet": "pets",
  "Bolos e Doces": "comida",
  "Cabeleireira": "beleza",
  "Calçados": "compras",
  "Calhas": "casa",
  "Câmeras e Alarmes": "casa",
  "Cantora": "prof",
  "Celulares": "tec",
  "Cestas de Café": "comida",
  "Cílios e Sobrancelhas": "beleza",
  "Clínica de Estética": "beleza",
  "Clínica Dentária": "saude",
  "Coloração Pessoal": "beleza",
  "Consultoria Ambiental": "prof",
  "Cortinas e Enxovais": "casa",
  "Costureira": "compras",
  "Creche": "compras",
  "Elétrica / Eletricista": "casa",
  "Eletroeletrônica": "tec",
  "Energia Solar": "casa",
  "Engenharia Civil": "casa",
  "Farmácia": "saude",
  "Faxina": "casa",
  "Ferramentas e Casa": "casa",
  "Financiamento Habitacional": "prof",
  "Fisioterapia": "saude",
  "Fotografia": "prof",
  "Frete": "carro",
  "Fundação e Escavação": "casa",
  "Higienização de Estofados": "casa",
  "Hotel e Creche Pet": "pets",
  "Impermeabilização": "casa",
  "Informática": "tec",
  "Investimentos": "prof",
  "Jardinagem": "casa",
  "Lavagem Automotiva": "carro",
  "Lavanderia": "compras",
  "Limpeza de Pele": "beleza",
  "Locação de Mesas": "compras",
  "Manicure": "beleza",
  "Marcenaria": "casa",
  "Marketing Digital": "tec",
  "Marmoraria": "casa",
  "Mecânica Automotiva": "carro",
  "Mercado": "comida",
  "Montagem de Móveis": "casa",
  "Motorista / Uber": "carro",
  "Negócios Imobiliários": "prof",
  "Nutricionista": "saude",
  "Papel de Parede": "casa",
  "Pedreiro": "casa",
  "Personal Trainer": "saude",
  "Pintura Predial": "casa",
  "Polimento Automotivo": "carro",
  "Portão e Cerca Elétrica": "casa",
  "Presentes": "compras",
  "Produtos Coloniais": "comida",
  "Psicologia": "saude",
  "Psicopedagogia": "saude",
  "Revendedoras": "compras",
  "Roupas e Vestuário": "compras",
  "Serralheria": "casa",
  "Serviços Gerais": "casa",
  "Tatuagem": "beleza",
  "Terapeuta": "saude",
  "Terapia Integrativa": "saude",
  "Toldos": "casa",
  "Topografia": "casa",
  "Veículos": "carro",
  "Vidros e Esquadrias": "casa",
};

window.CONTATOS = [
  // A
  { n: "Sansão Mundo Pet", c: ["Agropecuária"], t: ["48996460557"] },
  { n: "Social Pet Agropecuária", c: ["Agropecuária"], t: ["4797333240"], confirmar: true },
  { n: "Croc Prime Salgados", c: ["Alimentação"], t: ["48991419521"] },
  { n: "Sweet Donuts", d: "Paula", c: ["Alimentação", "Bolos e Doces"], t: ["48992003136"] },
  { n: "Authentic Hamburgueria", c: ["Alimentação"], t: ["48996826441"] },
  { n: "Sabores da Nona", c: ["Alimentação"], t: ["48991567585"] },
  { n: "Júlia Karnal", c: ["Assessoria Contábil"], t: ["54999091332"] },
  { n: "Taiani Mafessoli", d: "Direito cível", c: ["Advogado(a)"], t: ["48999233323"] },
  { n: "Heiv Car", c: ["Auto Elétrica"], t: ["48992005086"] },
  { n: "Luciane Leduc", c: ["Agronomia"], t: ["45999166606"] },
  { n: "MC Celulares e Notebooks", c: ["Assistência de Celulares"], t: ["48991390566"] },
  { n: "Ronaldo Arquiteto", c: ["Arquitetura"], t: ["47996195831"] },
  { n: "Mariana Moroz", c: ["Arquitetura"], t: ["47999970777"] },
  { n: "Okno Arquitetura e Interiores", c: ["Arquitetura"], t: ["47999874610"] },
  { n: "Double Arquitetura", d: "Débora", c: ["Arquitetura"], t: ["47989102291"] },
  { n: "Anama Arquitetura", c: ["Arquitetura"], t: ["47997791901"] },
  { n: "Fofuras da Day", c: ["Artesanato"], t: ["51984040885"] },
  { n: "Mimos Ingrid", c: ["Artesanato"], t: ["48999682772"] },
  { n: "Raaupi", d: "Paulo", c: ["Automação Residencial"], t: ["47992536532"] },
  { n: "Thaysa Mauad", c: ["Acupuntura"], t: ["47984734743"] },

  // B
  { n: "Pets do Bosque", c: ["Banho e Tosa Pet", "Hotel e Creche Pet"], t: ["48992054851"] },
  { n: "Hartmann Confeitaria", c: ["Bolos e Doces"], t: ["51999291385"] },
  { n: "Casa di Vovó", c: ["Bolos e Doces"], t: ["47996042694"] },
  { n: "Cookies do Niko", c: ["Bolos e Doces"], t: ["71987852897"] },

  // C
  { n: "Cabelos do Brasil", c: ["Cabeleireira"], t: ["48991597421"] },
  { n: "Studio Regina Machado", c: ["Cabeleireira"], t: ["47991882345"] },
  { n: "M.A Calhas", c: ["Calhas"], t: ["47999383460"] },
  { n: "DeA Instalações", c: ["Câmeras e Alarmes", "Portão e Cerca Elétrica"], t: ["48999119750"] },
  { n: "Mundo Digital", c: ["Câmeras e Alarmes"], t: ["47996332091"] },
  { n: "Oton Odontologia", c: ["Clínica Dentária"], t: ["48998650905"] },
  { n: "Orthodontic", c: ["Clínica Dentária"], t: ["4832632525"] },
  { n: "Vitalli Odontologia", c: ["Clínica Dentária"], t: ["48999796621"] },
  { n: "NeoGrass Odontologia", c: ["Clínica Dentária"], t: ["48999359091"] },
  { n: "Magnífica", d: "Caroline", c: ["Cílios e Sobrancelhas", "Limpeza de Pele"], t: ["41995993460"] },
  { n: "Bruna Sales", d: "MPB e samba", c: ["Cantora"], t: ["48996642291"] },
  { n: "Roca Interiores", c: ["Cortinas e Enxovais"], t: ["47996349629"] },
  { n: "Universo Baby", c: ["Creche"], t: ["47996123786"] },
  { n: "Regina", c: ["Costureira"], t: ["48996083952"] },
  { n: "O Celular", d: "iPhone · Douglas", c: ["Celulares"], t: ["48998338143"] },
  { n: "Pé na Areia", c: ["Calçados"], t: ["4831974097"] },
  { n: "Flor em Casa Tijucas", c: ["Cestas de Café"], t: ["48998577137"] },
  { n: "Mayandra", c: ["Clínica de Estética"], t: ["47997217470"] },
  { n: "Mydas Engenharia", c: ["Consultoria Ambiental"], t: ["48996396447"] },
  { n: "Fe Felcker", c: ["Coloração Pessoal", "Terapeuta"], t: ["55999491939"] },

  // E
  { n: "Volt'ary Instalações Elétricas", c: ["Elétrica / Eletricista"], t: ["47992571306"] },
  { n: "Energizar", c: ["Elétrica / Eletricista"], t: ["48991125543"] },
  { n: "Dagoberto Bertussi", c: ["Elétrica / Eletricista"], t: ["47991364589"] },
  { n: "Eletricsc.com", c: ["Elétrica / Eletricista"], t: ["48999029840"] },
  { n: "ZS Tech Instalações", c: ["Elétrica / Eletricista"], t: ["48991007119"] },
  { n: "J Santos Elétrica e Hidráulica", c: ["Elétrica / Eletricista"], t: ["48998486801"] },
  { n: "Soul Energy", c: ["Elétrica / Eletricista"], t: ["48991523708"] },
  { n: "IN Serviços", c: ["Elétrica / Eletricista", "Serviços Gerais"], t: ["47992409890"] },
  { n: "CS Placas Eletrônicas", c: ["Eletroeletrônica"], t: ["47996491894"] },
  { n: "Alpha Soluções Renováveis", c: ["Energia Solar"], t: ["48998654057"] },
  { n: "Spin Solar", c: ["Energia Solar"], t: ["4832630182"] },
  { n: "Fernando", d: "Engenheiro civil", c: ["Engenharia Civil"], t: ["47992883443"] },

  // F
  { n: "Vera Berlanda", c: ["Faxina"], t: ["47996523014"] },
  { n: "Beatriz", c: ["Faxina"], t: ["47997597710"] },
  { n: "Ale de Liz", c: ["Fotografia"], t: ["48991768638"] },
  { n: "Bruna Carla", c: ["Fotografia"], t: ["48991014479"] },
  { n: "Douglas", d: "Fisioterapeuta", c: ["Fisioterapia"], t: ["48984948417"] },
  { n: "Luciana Soares", c: ["Fisioterapia"], t: ["48988383427"] },
  { n: "Gislene C. de Melo", c: ["Fisioterapia"], t: ["47996469398"] },
  { n: "Paloma Costa N. Borges", c: ["Fisioterapia"], t: ["49999700857"] },
  { n: "Mais Q Popular", c: ["Farmácia"], t: ["48991266532"] },
  { n: "Clube do Construtor", c: ["Ferramentas e Casa"], t: ["41999997230"] },
  { n: "Luiz", d: "Fretes", c: ["Frete"], t: ["47984593251"] },
  { n: "NAF Correspondente", c: ["Financiamento Habitacional"], t: ["11941818340"] },
  { n: "Abatti Participações", c: ["Fundação e Escavação"], t: ["46991102003"] },

  // H
  { n: "Fábio Vinholi", c: ["Higienização de Estofados"], t: ["47999949434"] },

  // I
  { n: "Tech Informática", c: ["Informática"], t: ["48991850868"] },
  { n: "Tairone Gomes", c: ["Informática"], t: ["48984810426"] },
  { n: "Luiz Pinheiro", c: ["Informática"], t: ["47988701037"] },
  { n: "Impersol Construção", c: ["Impermeabilização"], t: ["48998119576"] },
  { n: "Guilherme Nyland", d: "XP Investimentos", c: ["Investimentos"], t: ["47988662805"] },

  // J
  { n: "Roberto", d: "Jardineiro", c: ["Jardinagem"], t: ["49999791935"] },

  // L
  { n: "Aroma Lavanderia", c: ["Lavanderia"], t: ["4832630914"] },
  { n: "Aroma Locações", c: ["Locação de Mesas"], t: ["48999941556"] },
  { n: "Alex", d: "Lavagem e polimento", c: ["Lavagem Automotiva", "Polimento Automotivo"], t: ["42999620233"] },

  // M
  { n: "Marcenaria Bosque da Mata", c: ["Marcenaria"], t: ["4792395256"], confirmar: true },
  { n: "Marcenaria Joelmir", c: ["Marcenaria"], t: ["48996339190"] },
  { n: "Realize Móveis", c: ["Marcenaria"], t: ["47996330040"] },
  { n: "JV Car", c: ["Mecânica Automotiva"], t: ["48998138911"] },
  { n: "Fernando", d: "Mecânico", c: ["Mecânica Automotiva"], t: ["48991887279"] },
  { n: "Melo", d: "Montador", c: ["Montagem de Móveis"], t: ["47996671002"] },
  { n: "Mercado Innocent", c: ["Mercado"], t: ["47997757226"] },
  { n: "Bruna Santos", c: ["Marketing Digital"], t: ["47996306547"] },
  { n: "Marmoraria Catixaba", c: ["Marmoraria"], t: ["47984337959"] },
  { n: "Bru Vieira", c: ["Manicure"], t: ["47999523450"] },

  // N
  { n: "Dimorare", d: "Luciene", c: ["Negócios Imobiliários"], t: ["48999930123"] },
  { n: "Bruno Rosa", d: "André", c: ["Negócios Imobiliários"], t: ["48996384507"] },
  { n: "Bruno Rosa", d: "Bruno", c: ["Negócios Imobiliários"], t: ["48991768889"] },
  { n: "Mariana Naegeli", c: ["Negócios Imobiliários"], t: ["47988157546"] },
  { n: "Lucas Illana", c: ["Negócios Imobiliários"], t: ["48996108354"] },
  { n: "Amanda Torres", c: ["Negócios Imobiliários"], t: ["48996642659"] },
  { n: "Rieger Imóveis", d: "Ricardo", c: ["Negócios Imobiliários"], t: ["47999672140"] },
  { n: "Rafael Machado", c: ["Negócios Imobiliários"], t: ["48996697589"] },
  { n: "Marineis Possamai", c: ["Negócios Imobiliários"], t: ["48991801044"] },
  { n: "Ana Caroline Libioda", c: ["Nutricionista"], t: ["47997602109"] },
  { n: "Angelica", d: "Nutricionista", c: ["Nutricionista"], t: ["47984094105"] },

  // P
  { n: "Carlos Eduardo", c: ["Personal Trainer"], t: ["51998027136"] },
  { n: "Filipe Campos", c: ["Personal Trainer"], t: ["43991616212"] },
  { n: "Ivolmar Pinturas", c: ["Pintura Predial"], t: ["47999676096"] },
  { n: "Antônio", d: "Pintor", c: ["Pintura Predial"], t: ["48988298376"] },
  { n: "Repinte Pinturas", c: ["Pintura Predial"], t: ["47992523321"] },
  { n: "Mannrich Pinturas", c: ["Pintura Predial"], t: ["48988516991"] },
  { n: "Adriana", d: "Psicopedagoga", c: ["Psicopedagogia"], t: ["51997446380"] },
  { n: "Juliane Benetti Landim", c: ["Psicologia"], t: ["48996180019"] },
  { n: "Marcos", d: "Pedreiro", c: ["Pedreiro"], t: ["47991797324"] },
  { n: "Vanessa Rettore", c: ["Papel de Parede"], t: ["47997260717"] },
  { n: "Karla", d: "Produtos coloniais", c: ["Produtos Coloniais"], t: ["48988006773"] },
  { n: "Adorê Presentes", c: ["Presentes"], t: ["4831973381"] },

  // R
  { n: "Dolly", d: "Natura, Boticário e Eudora", c: ["Revendedoras"], t: ["47991935142"] },
  { n: "Giane", d: "dōTERRA", c: ["Revendedoras"], t: ["48992125372"] },
  { n: "Vivian", d: "Tupperware", c: ["Revendedoras"], t: ["44999073672"] },
  { n: "Patricia", d: "Mary Kay", c: ["Revendedoras"], t: ["48991095165"] },
  { n: "Fátima Modas", c: ["Roupas e Vestuário"], t: ["48999344564"] },

  // S
  { n: "Toldomar", c: ["Serralheria", "Toldos"], t: ["48996205637"] },
  { n: "Dirlei", d: "Serralheiro", c: ["Serralheria"], t: ["49999119686"] },

  // T
  { n: "JC Topografia", c: ["Topografia"], t: ["47984134923"] },
  { n: "Eli Piton Tatoo", c: ["Tatuagem"], t: ["47999193305"] },
  { n: "Cristiane Dalla Nora", c: ["Terapeuta"], t: ["47992381084"] },
  { n: "Livia Teixeira", c: ["Terapia Integrativa"], t: ["489884378"], confirmar: true },

  // U
  { n: "Kuester Transportes", c: ["Motorista / Uber"], t: ["47988810400"] },
  { n: "Beto", d: "Motorista particular", c: ["Motorista / Uber"], t: ["48991555348"] },
  { n: "Hildara", d: "Motorista particular", c: ["Motorista / Uber"], t: ["55999476136"] },
  { n: "Jean Michel", d: "Uber", c: ["Motorista / Uber"], t: ["51996176968"] },

  // V
  { n: "VA Vidros e Esquadrias", c: ["Vidros e Esquadrias"], t: ["48999284025"] },
  { n: "Franzen", c: ["Vidros e Esquadrias"], t: ["48999617506", "48996161012"] },
  { n: "RS Veículos", c: ["Veículos"], t: ["47999226400", "48998163568"] },
];
