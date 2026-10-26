export const BLUEPRINT_V2_FPS = 30;

// Calibrated from the existing lesson-one Mandarin narration: 3333 spoken
// characters over 698.8 seconds. This is an estimate until the V2 recording
// exists; the narration text below is the single source of truth for timing.
export const V2_ESTIMATED_SPOKEN_CHARS_PER_SECOND = 4.77;

const spokenCharacterCount = (text: string) =>
  text.replace(/[\s，。！？：；、“”‘’（）()\-—…·\/「」『』\[\]【】,.%]/g, '').length;

const estimateFrames = (narration: string) =>
  Math.ceil(
    (spokenCharacterCount(narration) / V2_ESTIMATED_SPOKEN_CHARS_PER_SECOND) *
      BLUEPRINT_V2_FPS,
  );

const scene = (
  id: string,
  title: string,
  designFrames: number,
  section: number,
  narration: string,
) => ({id, title, designFrames, section, narration, frames: estimateFrames(narration)});

export const BLUEPRINT_V2_SCENES = [
  scene('opening-question', '输入一句话后，AI 如何生成完整回答？', 300, 1,
    '我们每天使用的 AI 产品，背后的核心能力来自哪里？我们平时用 ChatGPT、DeepSeek、豆包的时候，操作其实都很简单。打开聊天框，输入一句话，AI 很快就会给我们回答。它可以帮我们写文章、总结资料、修改文案、解释问题，有时候你给它一个比较复杂的任务，它也能继续往下分析和处理。但如果再往里面追问一步：你输入这句话以后，到 AI 给出回答之前，中间到底发生了什么？这就是这一课要解决的问题。'),
  scene('product-model', '你用的是产品，背后是大模型', 210, 1,
    '首先，ChatGPT、DeepSeek、豆包，这些都是一个个完整的 AI 产品。我们看到的聊天窗口、文件上传、联网搜索、语音对话，以及各种功能和按钮，都属于产品的一部分。而这些产品能理解我们的内容、生成回答，背后的核心能力，就是大模型。所以这里可以先建立一个很简单的关系：我们直接使用的是 AI 产品，而大模型是这些产品背后的核心能力。接下来，我们就从大模型开始，看看它到底是什么，又是怎么生成回答的。'),
  scene('llm-patterns', '从海量内容中，学习复杂规律', 210, 2,
    '什么是大模型，或者 LLM？我们经常会看到一个缩写：LLM。它的全称是 Large Language Model，大语言模型，简称大模型。它是靠海量数据训练出来的，至于具体怎么训练的，咱们先不用管。我们先把它理解成：一个通过大量数据学习了语言、知识和内容之间复杂规律，并且能够根据已有内容继续生成内容的模型。那接下来问题就来了。它到底是怎么生成的？为什么我们问它一句话，它就能接着写出一整段回答？'),
  scene('predict-next', '接下来，最可能出现什么？', 210, 3,
    '大模型为什么能够生成回答？我们来看一个很简单的例子。假如现在有这样一句话：手机只剩 1% 的电，我赶紧找……'),
  scene('probability', '不是所有答案，都一样可能', 240, 3,
    '如果让你继续往后接，你可能会想到：充电器、充电宝、插座、遥控器。这些内容都有可能出现，但出现的可能性显然并不一样。比如在这个语境下，充电器、充电宝出现的可能性，通常会比遥控器高很多。大模型生成文字的时候，也会做类似的事情。它会根据前面已经有的内容，以及自己过去学习到的大量规律，判断接下来哪些内容出现的可能性更高。'),
  scene('generation-loop', '预测、接上、再预测', 210, 3,
    '假设这一次，它生成了一部分内容。生成以后，它不会停下来。它会把刚刚生成出来的内容继续放到前面已有内容的后面，然后再继续预测接下来可能出现什么。生成一个，接上去，再预测下一个，再接上去。这个过程会不断重复，最后逐渐形成我们看到的一整段回答。所以，如果只看大模型生成文本这件事，它本质上可以理解成一个非常复杂的文字接龙游戏。'),
  scene('token-chain', '它接的，不是一个个汉字', 210, 3,
    '但是这里一定要注意：它真正接的，并不是一个个汉字，也不一定是一个个词。它真正往后接的是一个个 Token。'),
  scene('streaming', '为什么回答一点一点出现？', 210, 4,
    '为什么 AI 的内容会一点一点生成出来？理解了刚才这个过程，也就能解释一个我们每天都能看到的现象。为什么 AI 回答问题的时候，文字经常是一点一点出现的？因为模型的回答本身就是逐步生成的。它先生成一个 Token，再根据现在已有的内容生成下一个 Token，然后继续往后。很多 AI 产品又会把已经生成出来的内容持续显示到界面上，所以我们最终看到的就是：回答一点一点地出现。它并不是先把整篇答案完整生成好，再故意做一个打字效果。而是答案本身就在持续生成。那 Token 到底是什么？这就是接下来真正需要搞懂的东西。'),
  scene('token-definition', 'Token，是模型处理文本的单位', 210, 5,
    'Token 是什么？如果以后稍微深入一点使用 AI，你会发现 Token 这个词经常出现。比如：100 万 Token 上下文、输入 Token、输出 Token、每百万 Token 多少钱。这些说的都是 Token，那 Token 到底是什么？可以先把它理解成大模型处理和生成文本时使用的基本单位。'),
  scene('token-size', 'Token，没有固定大小', 210, 5,
    '这里特别容易产生一个误解。刚才我们看到 AI 的回答好像一个字一个字往外出现，所以很容易认为：一个 Token 是不是就等于一个汉字？并不是。一个 Token，不固定等于一个汉字，也不固定等于一个英文单词，甚至不固定等于一个字符。所以刚才说大模型在玩文字接龙，只是为了方便理解这个生成过程。更准确一点说，它是在不断进行 Token 接龙。那问题又来了。我们输入的明明是正常的文字，它是怎么变成 Token 的？这中间还需要经过一个东西：Tokenizer。'),
  scene('tokenizer', 'Tokenizer：把文字切成 Token', 240, 6,
    'Tokenizer 是怎么把文字切分成 Token 的？假设我们输入一句：手机只剩 1% 的电，我赶紧找充电器。对我们来说，这就是一句正常的中文。但在交给大模型处理之前，文本会先经过 Tokenizer。Tokenizer 会按照自己的一套词表和切分规则，把我们输入的内容，拆成一个个 Token。这个过程，我们可以简单理解为：文字，经过 Tokenizer 处理之后，就变成了一个个 Token。'),
  scene('tokenizer-difference', '同一句话，可以有不同切法', 240, 6,
    '也就是说，Tokenizer 决定了一段文字最终会怎样被切成 Token。不同模型使用的 Tokenizer 可能不同，因此同一段文字在不同模型里，Token 的切分和数量也可能有所不同。但这里还有一个问题。模型里面真的直接在处理手机、充电器这些文字吗？其实也不是。'),
  scene('token-id', '每个 Token，都有一个数字编号', 240, 7,
    'Token、Token ID、编码与解码是什么关系？刚才我们已经把文字切成了一个个 Token。但大模型内部真正进行计算的时候，还不能直接拿这些文字来计算。每一个 Token，在对应的词表里面，都会有一个专属的数字编号，这个编号就叫做 Token ID。一个 Token 对应一个编号，具体编号是多少，对我们来说并不重要。重要的是理解：我们输入的是人能看懂的文字，而进入模型计算之前，这些文字会被转换成 Token 以及对应的 Token ID。'),
  scene('encoding-decoding', 'Encoding → Model → Decoding', 240, 7,
    '这个从文字转换成 Token 和 Token ID 的过程，通常就叫 Encoding，编码。模型生成完以后，还需要反过来。把生成出来的 Token ID 转换回 Token，再变成人能够看到的文字。这个过程就是 Decoding，解码。所以整个流程可以这么理解：我们输入人类的文字，先经过编码，转换成 Token 还有 Token ID，交给大模型去处理、生成内容；大模型输出的还是 Token 和 Token ID，再经过解码，最后就变成我们看到的回答了。Encoding、Decoding 这两个名字知道就可以了，这一课真正需要理解的是这条转换关系。'),
  scene('real-chinese', '中文并非一字一 Token', 240, 8,
    '为什么 Token 不等于汉字、单词或者字符？那一个 Token 到底对应多少文字？没有一个固定答案。原因就在于，Tokenizer 有自己的词表和切分规则。这件事只靠解释还是不够直观，我们直接打开一个真实的 Tokenizer 看一下。我们先输入：手机只剩 1% 的电，我赶紧找充电器。大家可以先看一下这句话有多少个汉字，然后再看 Tokenizer 实际把它切成多少个 Token。重点不是记住具体数字，而是观察 Token 的切分是不是严格按照一个汉字一个 Token 来进行。'),
  scene('mixed-text', '中文、英文、空格、标点', 240, 8,
    '接下来再换一句更接近日常聊天的内容：这个 PPT 明天要交，帮我 check 一下。这里同时有中文、英文、标点。我们再看一次实际切分。'),
  scene('not-equal', '1M Token，不等于 100 万汉字', 210, 8,
    '你会发现，我们肉眼看到的字符数量，和最终得到的 Token 数量，并没有一个简单固定的换算关系。Token 和汉字、单词、字符之间，也没有固定的一一对应关系。所以以后如果有人告诉你，这个模型支持 100 万 Token，千万不要直接把它理解成可以放进去 100 万个汉字，这两件事不能直接画等号。'),
  scene('context-impact', 'AI 一次能处理多少内容？', 240, 9,
    'Token 为什么会影响上下文长度、生成长度和使用成本？讲到这儿，可能有人会问了：我又不去训练大模型，干嘛要搞懂什么是 Token 呢？其实 Token 并不是离我们很远的技术名词，它会直接关系到我们在用 AI 的时候，经常碰到的三个实际问题。第一个，就是 AI 一次最多能处理多少内容。我们普通人看文档，一般都会说，这份 PDF 有 50 页，这篇文章有两万字。但是大模型判断自己一次能处理多少文字，用的单位是 Token。所以之后你会经常看到 128K Token、1M Token 这类数字，这些代表的就是 AI 单次能够处理的上下文长度。'),
  scene('output-impact', 'AI 一次能输出多长？', 240, 9,
    '第二点，AI 一次最多能输出多长的回复。AI 给我们的回答，本身同样是一个个 Token 生成出来的。所以 Token 不光是我们发给 AI 的输入内容，AI 输出的结果同样也是 Token。模型允许生成的 Token 上限，就决定了它一次最多能输出多少内容。'),
  scene('cost-impact', '为什么使用成本按 Token 计算？', 240, 9,
    '第三点，就是使用成本。如果你之后要用到大模型的 API，或者去开发一些 AI 相关的工具，就会看到计费规则，比如每百万输入 Token 多少钱、每百万输出 Token 多少钱，就是按 Token 来算费用的。市面上绝大多数的 AI 模型服务，都是按用了多少 Token 来统计用量和计算费用的。所以大家今天弄懂了 Token，之后再遇到这些问题，就一点都不陌生了。'),
  scene('full-chain', '从输入文字，到生成回答', 240, 9,
    '最后，我们把整个过程再串一遍：我们输入文字，Tokenizer 会把这些文字，拆成对应的 Token 和 Token ID。接着大模型会根据现有内容，不断预测并生成下一个 Token。就这样一个接一个持续生成，最后再把这些 Token 解码，变成我们能看懂的文字。到这里，我们就把 AI 从输入文字到生成回答的工作原理，完整拆解了一遍。'),
] as const;

export const BLUEPRINT_V2_SCENE_STARTS = BLUEPRINT_V2_SCENES.map(
  (_, index) => BLUEPRINT_V2_SCENES.slice(0, index).reduce((sum, item) => sum + item.frames, 0),
);

export const BLUEPRINT_V2_TOTAL_FRAMES = BLUEPRINT_V2_SCENES.reduce(
  (sum, item) => sum + item.frames,
  0,
);

export const BLUEPRINT_V2_ESTIMATED_SECONDS = BLUEPRINT_V2_TOTAL_FRAMES / BLUEPRINT_V2_FPS;
