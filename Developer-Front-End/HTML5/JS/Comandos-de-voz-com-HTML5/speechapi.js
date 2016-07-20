// Fazemos que o código só funcione apos o carregamento completo da pagina
window.addEventListener('DOMContentLoaded', function() {
  // Crio uma função para definir o primeri caracter em caixa alta.
  function capitalize(s) {
    return s.replace(/\S/, function(m) {
      return m.toUpperCase();
    });
  }

  // Instanciamos o nosso botão
  var btn_gravacao = document.querySelector('#btn_gravar_audio');
  // Crio a variavel que amarzenara a transcrição do audio
  var transcricao_audio = '';
  // Seto o valor false para a variavel esta_gravando para fazermos a validação se iniciou a gravação
  var esta_gravando = false;
  // Verificamos se o navegador tem suporte ao Speech API
  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    // Como não sabemos qual biblioteca usada pelo navegador 
    // Atribuimos a api retornada pelo navegador
    var captura_audio = window.SpeechRecognition || window.webkitSpeechRecognition;
    // Criamos um novo objeto com a API Speech
    var recebe_audio = new captura_audio();
    // Defino se a gravação sera continuo ou não
    recebe_audio.continuous = false;
    // Especifico se o resultado final pode ser alterado ou não
    recebe_audio.interimResults = false;
    // Especifico o idioma utilizado pelo usuario
    recebe_audio.lang = "pt-BR";

    // uso o metodo onstart para setar a minha variavel esta_gravando como true
    recebe_audio.onstart = function() {
      esta_gravando = true;
    };
    // uso o metodo onend para setar a minha variavel esta_gravando como false
    recebe_audio.onend = function() {
      esta_gravando = false;
    };
    // Com o metodo onresult posso capturar a transcrição do resultado 
    recebe_audio.onresult = function(event) {
      // Defino a minha variavel interim_transcript como vazia
      var interim_transcript = '';
      // Utilizo o for para contatenar os resultados da transcrição 
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        // verifico se o parametro isFinal esta setado como true com isso identico se é o final captura
        if (event.results[i].isFinal) {
          // Contateno o resultado final da transcrição
          transcricao_audio += event.results[i][0].transcript;
        } else {
          // caso ainda não seja o resultado final vou contatenado os resultados obtidos
          interim_transcript += event.results[i][0].transcript;
        }
      }
      // Utilizo a função capitalize para deixar a primeira letra em caixa alta
      transcricao_audio = capitalize(transcricao_audio);
      // Verifico qual das variaveis estão vazias e 
      if (transcricao_audio || interim_transcript) {
        // Escrevo o resultado no campo da textarea
        document.getElementById('campo_texto').innerHTML = transcricao_audio || interim_transcript;
      }
    };
    // Capturamos a ação do click no botão e iniciamos a gravação
    btn_gravacao.addEventListener('click', function(e) {
      // Verifico se esta gravando ou não
      if (esta_gravando) {
        // Se estiver gravando mando parar a gravação
        recebe_audio.stop();
        // Mudo o texto do botão para Iniciar Gravação!
        btn_gravacao.innerHTML = 'Iniciar Gravação!';
        // Dou um retun para sair da função
        return;
      }
      // Caso não esteja capturando o audio iniciao transcrição
      recebe_audio.start();
      // Mudo o texto do botão para Parar Gravação!
      btn_gravacao.innerHTML = 'Parar Gravação!';

    }, false);
  } else {
    // Caso não o navegador não apresente suporte ao Speech API apresentamos a seguinte mensagem
    alert('Este navegador não apresenta suporte para essa funcionalidade ainda');
  }
}, false);