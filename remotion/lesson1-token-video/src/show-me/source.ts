// Imported from outputs/show-me-ai-product/show-me-ai-product.html.
// Editable snapshot. Re-running scripts/import-show-me.py replaces this file.
// Timing is the original 84-second narration estimate, not audio alignment.
export type ShowMeNode =
  | string
  | {
      tag: string;
      attrs: Record<string, string | null>;
      children: ShowMeNode[];
    };
export type ShowMeScene = {
  name: string;
  duration: number;
  beats: {at: number; label: string}[];
  narration: string;
  direction: string;
  tree: ShowMeNode;
};
export type ShowMeSource = {
  css: string;
  icons: ShowMeNode;
  texts: Record<string, string>;
  scenes: ShowMeScene[];
};
export const showMeSource: ShowMeSource = {
  css: '.lesson1-show-me{--paper:#f8f8f4;--ink:#24392f;--muted:#78877c;--green:#1f7b59;--green-soft:#e5efe5;--line:#dce3da;--orange:#cc7643;--ui:#eef1eb;--stage-scale:1;margin:0;background:var(--ui);color:var(--ink);font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif;-webkit-font-smoothing:antialiased}\n.lesson1-show-me,.lesson1-show-me *{box-sizing:border-box}\n.lesson1-show-me .stage{width:1920px;height:1080px;position:absolute;left:0;top:0;transform:scale(var(--stage-scale));transform-origin:top left;background:var(--paper);overflow:hidden}\n.lesson1-show-me .stage::after{content:"";position:absolute;inset:36px;border:1px solid #e1e5dc;pointer-events:none;border-radius:6px}\n.lesson1-show-me .scene{position:absolute;inset:0;display:none;overflow:hidden}\n.lesson1-show-me .scene.active{display:block}\n.lesson1-show-me .scene-inner{height:100%;padding:138px 150px 110px;display:flex;align-items:center;flex-direction:column;justify-content:center;text-align:center;gap:62px}\n.lesson1-show-me .eyebrow{display:flex;align-items:center;justify-content:center;gap:14px;color:var(--green);font-size:28px;font-weight:550;letter-spacing:5px;margin-bottom:24px}\n.lesson1-show-me .eyebrow::before{content:"";width:26px;height:3px;border-radius:2px;background:var(--green)}\n.lesson1-show-me .headline{font-size:84px;line-height:1.22;letter-spacing:-3px;margin:0;font-weight:650;text-wrap:balance}\n.lesson1-show-me .green{color:var(--green)}\n.lesson1-show-me .brand-row{display:flex;align-items:center;justify-content:center;gap:22px}\n.lesson1-show-me .brand{height:86px;display:flex;align-items:center;gap:17px;padding:0 28px;background:white;border:2px solid var(--line);border-radius:22px;font-size:43px;font-weight:550;letter-spacing:-.6px}\n.lesson1-show-me .brand-dot{width:12px;height:12px;border-radius:50%;background:var(--green)}\n.lesson1-show-me .brand:nth-child(2) .brand-dot{background:#7286b9}\n.lesson1-show-me .brand:nth-child(3) .brand-dot{background:#c29368}\n.lesson1-show-me .flow{display:flex;align-items:center;justify-content:center;gap:35px}\n.lesson1-show-me .flow-card{width:570px;height:245px;padding:40px 48px;background:#fff;border:2px solid var(--line);border-radius:30px;text-align:left;display:flex;flex-direction:column;justify-content:center;gap:21px}\n.lesson1-show-me .flow-card.answer{background:var(--green-soft);border-color:#cbdcc7}\n.lesson1-show-me .card-label{display:flex;align-items:center;gap:16px;font-size:32px;color:#69796c}\n.lesson1-show-me .card-main{font-size:56px;line-height:1.35;font-weight:600;letter-spacing:-1px}\n.lesson1-show-me .answer .card-main{color:var(--green)}\n.lesson1-show-me .flow-arrow{width:112px;display:grid;place-items:center;color:#93a58e}\n.lesson1-show-me .icon{width:38px;height:38px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}\n.lesson1-show-me .flow-arrow .icon{width:100px;height:70px;stroke-width:1.5}\n.lesson1-show-me .short-note{font-size:39px;color:#748170;letter-spacing:2px}\n.lesson1-show-me .s1 .scene-inner{gap:48px}\n.lesson1-show-me .s1 .flow{margin-top:6px}\n.lesson1-show-me .s2 .scene-inner{gap:68px}\n.lesson1-show-me .capabilities{display:grid;grid-template-columns:repeat(4,1fr);gap:25px;width:1480px}\n.lesson1-show-me .capability{height:270px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:32px;background:#fff;border:2px solid var(--line);border-radius:28px}\n.lesson1-show-me .capability .icon{width:62px;height:62px;color:var(--green);stroke-width:1.35}\n.lesson1-show-me .capability span{font-size:53px;font-weight:550;letter-spacing:-1px}\n.lesson1-show-me .complex-task{display:flex;align-items:center;justify-content:center;gap:29px;font-size:42px}\n.lesson1-show-me .complex-tag{border-radius:12px;background:#e9ede4;padding:15px 26px;font-weight:550}\n.lesson1-show-me .complex-detail{color:#637763}\n.lesson1-show-me .complex-task .icon{width:54px;color:#879781}\n.lesson1-show-me .s3 .scene-inner{gap:65px}\n.lesson1-show-me .s3 .headline{font-size:64px;letter-spacing:-2px;font-weight:550;color:#667767}\n.lesson1-show-me .mystery-flow{display:flex;align-items:center;gap:48px}\n.lesson1-show-me .endpoint{display:flex;align-items:center;justify-content:center;gap:22px;width:390px;height:160px;border:2px solid var(--line);background:#fff;border-radius:25px;font-size:58px;font-weight:550}\n.lesson1-show-me .endpoint .icon{width:55px;height:55px;color:#83947f}\n.lesson1-show-me .mystery{display:flex;align-items:center;gap:38px}\n.lesson1-show-me .mystery-line{width:80px;height:2px;background:#bbc8b5}\n.lesson1-show-me .mystery-box{height:192px;width:192px;display:grid;place-items:center;color:var(--orange);background:#f4e8dc;border:2px solid #e9cbb0;border-radius:36px;font-size:126px;line-height:1;font-family:Georgia,serif}\n.lesson1-show-me .big-question{font-size:98px;line-height:1.2;font-weight:650;letter-spacing:-3px;margin:0}\n.lesson1-show-me .s4 .scene-inner{gap:44px}\n.lesson1-show-me .product-frame{width:1470px;border:2px solid #b6cbb2;background:#f0f4ec;border-radius:38px;padding:32px 52px 45px;position:relative}\n.lesson1-show-me .frame-heading{display:flex;align-items:center;justify-content:center;gap:16px;font-size:34px;color:#5b7954;letter-spacing:3px;margin-bottom:26px}\n.lesson1-show-me .frame-heading .icon{width:38px}\n.lesson1-show-me .s4 .brand-row{gap:28px;margin-bottom:30px}\n.lesson1-show-me .s4 .brand{height:76px;font-size:40px;padding:0 30px;border-color:#d9e2d3;border-radius:18px}\n.lesson1-show-me .feature-row{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}\n.lesson1-show-me .feature{height:154px;background:#fff;border:1px solid #d7e0d1;border-radius:21px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:20px;font-size:43px;white-space:nowrap}\n.lesson1-show-me .feature .icon{width:42px;height:42px;color:#6b8260}\n.lesson1-show-me .product-note{font-size:43px;letter-spacing:1px;color:#5e7656}\n.lesson1-show-me .s5 .scene-inner{gap:45px}\n.lesson1-show-me .s5 .headline{font-size:79px}\n.lesson1-show-me .model-product{width:1420px;padding:27px 46px 43px;border:2px solid #b2c7a9;background:#f0f4ec;border-radius:40px;position:relative}\n.lesson1-show-me .model-product-header{display:flex;justify-content:space-between;align-items:center;font-size:34px;padding:0 5px 24px}\n.lesson1-show-me .model-product-title{font-weight:600;display:flex;align-items:center;gap:14px}\n.lesson1-show-me .surface-functions{color:#7c8d72;font-size:30px;letter-spacing:3px}\n.lesson1-show-me .model-core{width:1060px;height:286px;margin:8px auto 0;background:var(--ink);color:#f2f5e9;border-radius:30px;position:relative;display:flex;align-items:center;justify-content:center;gap:58px}\n.lesson1-show-me .model-core::before,.lesson1-show-me .model-core::after{content:"";position:absolute;width:70px;height:1px;background:#a6b99c;top:50%}\n.lesson1-show-me .model-core::before{right:100%}\n.lesson1-show-me .model-core::after{left:100%}\n.lesson1-show-me .core-symbol{height:138px;width:138px;color:#a8cf99;stroke-width:1.1}\n.lesson1-show-me .core-copy{display:flex;flex-direction:column;align-items:flex-start;gap:6px}\n.lesson1-show-me .core-overline{font-size:31px;color:#adc6a0;letter-spacing:5px}\n.lesson1-show-me .core-title{font-size:110px;line-height:1.2;letter-spacing:5px;font-weight:600}\n.lesson1-show-me .core-functions{display:flex;justify-content:center;align-items:center;gap:30px;font-size:49px;margin-top:34px;color:var(--green);font-weight:550}\n.lesson1-show-me .core-functions .icon{width:62px;height:46px;color:#8da081}\n.lesson1-show-me .s6 .scene-inner{gap:75px}\n.lesson1-show-me .s6 .headline{font-size:74px}\n.lesson1-show-me .relationship{display:flex;align-items:center;justify-content:center}\n.lesson1-show-me .we-node{width:220px;display:flex;flex-direction:column;align-items:center;gap:23px;font-size:57px;font-weight:550}\n.lesson1-show-me .we-node .icon{width:94px;height:94px;stroke-width:1.2;color:#5b7952}\n.lesson1-show-me .relation-arrow{width:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;color:#6e8065;font-size:33px;white-space:nowrap}\n.lesson1-show-me .relation-arrow .icon{width:195px;height:55px;stroke-width:1.3}\n.lesson1-show-me .relation-node{height:243px;width:438px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;border-radius:31px;background:#fff;border:2px solid #c6d4bd}\n.lesson1-show-me .relation-title{font-size:78px;line-height:1.15;letter-spacing:-1px;font-weight:600}\n.lesson1-show-me .relation-sub{font-size:32px;color:#6d7d63;letter-spacing:1px}\n.lesson1-show-me .relation-node.core{background:var(--ink);border-color:var(--ink);color:#f2f5e9}\n.lesson1-show-me .relation-node.core .relation-sub{color:#bad2ae}\n.lesson1-show-me .final-line{font-size:57px;line-height:1.5;letter-spacing:1px}\n.lesson1-show-me .final-line strong{font-weight:650;color:var(--green)}\n.lesson1-show-me .reveal{will-change:opacity,transform}',
  icons: {
    tag: 'svg',
    attrs: {
      width: '0',
      height: '0',
      style: 'position:absolute',
      'aria-hidden': 'true',
    },
    children: [
      {
        tag: 'defs',
        attrs: {},
        children: [
          {
            tag: 'symbol',
            attrs: {
              id: 'i-chat',
              viewbox: '0 0 48 48',
            },
            children: [
              {
                tag: 'path',
                attrs: {
                  d: 'M10 8h28a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H20L9 43v-7a4 4 0 0 1-4-4V13a5 5 0 0 1 5-5Z',
                },
                children: [],
              },
              {
                tag: 'path',
                attrs: {
                  d: 'M14 18h19M14 26h13',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-spark',
              viewbox: '0 0 48 48',
            },
            children: [
              {
                tag: 'path',
                attrs: {
                  d: 'm25 5 5 14 14 5-14 5-5 14-5-14-14-5 14-5Z',
                },
                children: [],
              },
              {
                tag: 'path',
                attrs: {
                  d: 'm8 4 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-arrow',
              viewbox: '0 0 100 40',
            },
            children: [
              {
                tag: 'path',
                attrs: {
                  d: 'M5 20h87M76 5l16 15-16 15',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-back',
              viewbox: '0 0 100 40',
            },
            children: [
              {
                tag: 'path',
                attrs: {
                  d: 'M95 20H8M24 5 8 20l16 15',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-write',
              viewbox: '0 0 48 48',
            },
            children: [
              {
                tag: 'path',
                attrs: {
                  d: 'M28 8H10a4 4 0 0 0-4 4v27a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V22M15 22h7M15 31h16M30 6l6-4 9 9-4 6-16 16-10 3 3-10Z',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-summary',
              viewbox: '0 0 48 48',
            },
            children: [
              {
                tag: 'path',
                attrs: {
                  d: 'M14 5h25a4 4 0 0 1 4 4v28M9 13h23a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V17a4 4 0 0 1 4-4Z',
                },
                children: [],
              },
              {
                tag: 'path',
                attrs: {
                  d: 'M13 23h15M13 31h15M13 37h8',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-edit',
              viewbox: '0 0 48 48',
            },
            children: [
              {
                tag: 'path',
                attrs: {
                  d: 'M6 11h36M6 24h16M6 37h11M32 23l5-5 8 8-5 5-12 12-11 2 3-10ZM29 26l8 8',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-question',
              viewbox: '0 0 48 48',
            },
            children: [
              {
                tag: 'circle',
                attrs: {
                  cx: '24',
                  cy: '24',
                  r: '20',
                },
                children: [],
              },
              {
                tag: 'path',
                attrs: {
                  d: 'M18 17a6 6 0 1 1 10 4c-3 2-4 3-4 7M24 34v1',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-file',
              viewbox: '0 0 48 48',
            },
            children: [
              {
                tag: 'path',
                attrs: {
                  d: 'M27 4H11a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h26a4 4 0 0 0 4-4V18L27 4Z',
                },
                children: [],
              },
              {
                tag: 'path',
                attrs: {
                  d: 'M27 4v14h14M24 36V24m-6 6 6-6 6 6',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-search',
              viewbox: '0 0 48 48',
            },
            children: [
              {
                tag: 'circle',
                attrs: {
                  cx: '21',
                  cy: '21',
                  r: '15',
                },
                children: [],
              },
              {
                tag: 'path',
                attrs: {
                  d: 'm32 32 12 12M7 21h28M21 6c-9 9-9 21 0 30 9-9 9-21 0-30Z',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-mic',
              viewbox: '0 0 48 48',
            },
            children: [
              {
                tag: 'rect',
                attrs: {
                  x: '16',
                  y: '3',
                  width: '16',
                  height: '27',
                  rx: '8',
                },
                children: [],
              },
              {
                tag: 'path',
                attrs: {
                  d: 'M9 22a15 15 0 0 0 30 0M24 37v8M16 45h16',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-product',
              viewbox: '0 0 48 48',
            },
            children: [
              {
                tag: 'rect',
                attrs: {
                  x: '4',
                  y: '6',
                  width: '40',
                  height: '36',
                  rx: '6',
                },
                children: [],
              },
              {
                tag: 'path',
                attrs: {
                  d: 'M4 17h40M12 11h1M19 11h1M15 28h18M15 34h11',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-core',
              viewbox: '0 0 100 100',
            },
            children: [
              {
                tag: 'rect',
                attrs: {
                  x: '21',
                  y: '21',
                  width: '58',
                  height: '58',
                  rx: '14',
                },
                children: [],
              },
              {
                tag: 'rect',
                attrs: {
                  x: '36',
                  y: '36',
                  width: '28',
                  height: '28',
                  rx: '7',
                },
                children: [],
              },
              {
                tag: 'path',
                attrs: {
                  d: 'M35 9v12M50 9v12M65 9v12M35 79v12M50 79v12M65 79v12M9 35h12M9 50h12M9 65h12M79 35h12M79 50h12M79 65h12',
                },
                children: [],
              },
            ],
          },
          {
            tag: 'symbol',
            attrs: {
              id: 'i-user',
              viewbox: '0 0 100 100',
            },
            children: [
              {
                tag: 'circle',
                attrs: {
                  cx: '50',
                  cy: '29',
                  r: '18',
                },
                children: [],
              },
              {
                tag: 'path',
                attrs: {
                  d: 'M15 88v-7a35 28 0 0 1 70 0v7Z',
                },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  texts: {
    's1-label': '日常使用',
    's1-title': '一句话，就能开始',
    's1-brand1': 'ChatGPT',
    's1-brand2': 'DeepSeek',
    's1-brand3': '豆包',
    's1-input-label': '打开聊天框',
    's1-input': '输入一句话',
    's1-response-label': 'AI 很快回应',
    's1-response': '得到一个回答',
    's2-label': '熟悉的能力',
    's2-title': '它能帮你做很多事',
    's2-write': '写文章',
    's2-summarize': '总结资料',
    's2-rewrite': '修改文案',
    's2-explain': '解释问题',
    's2-complex': '复杂任务',
    's2-complex-detail': '继续分析 · 逐步处理',
    's3-title': '输入之后，回答之前',
    's3-input': '你的输入',
    's3-mark': '?',
    's3-answer': 'AI 回答',
    's3-question': '中间发生了什么？',
    's4-label': '先分清一个概念',
    's4-title': '你用的是 AI 产品',
    's4-frame': '完整的 AI 产品',
    's4-brand1': 'ChatGPT',
    's4-brand2': 'DeepSeek',
    's4-brand3': '豆包',
    's4-chat': '聊天窗口',
    's4-file': '文件上传',
    's4-search': '联网搜索',
    's4-voice': '语音对话',
    's4-note': '这些功能，都属于产品的一部分',
    's5-label': '再看产品背后',
    's5-title': '核心能力，来自大模型',
    's5-product': 'AI 产品',
    's5-features': '聊天 · 文件 · 搜索 · 语音',
    's5-core-label': '背后的核心能力',
    's5-core': '大模型',
    's5-understand': '理解内容',
    's5-generate': '生成回答',
    's6-label': '建立一个简单的关系',
    's6-title': '我们用产品，模型提供能力',
    's6-we': '我们',
    's6-use': '直接使用',
    's6-product': 'AI 产品',
    's6-product-sub': '我们操作的入口',
    's6-provide': '提供核心能力',
    's6-model': '大模型',
    's6-model-sub': '理解内容 · 生成回答',
    's6-final1': '用的是',
    's6-final2': '产品',
    's6-final3': '，背后是',
    's6-final4': '大模型',
  },
  scenes: [
    {
      name: '一句话开始',
      duration: 13,
      beats: [
        {
          at: 0,
          label: '标题与三个产品名',
        },
        {
          at: 3,
          label: '打开聊天框，输入一句话',
        },
        {
          at: 5.5,
          label: '连接输入与回答',
        },
        {
          at: 7,
          label: 'AI 很快给出回答',
        },
      ],
      narration:
        '我们平时用 ChatGPT、DeepSeek、豆包的时候，操作其实都很简单。打开聊天框，输入一句话，AI 很快就会给我们回答。',
      direction: '同一页完成使用流程：先产品名，再输入，最后出现回答。',
      tree: {
        tag: 'section',
        attrs: {
          class: 'scene s1 active',
          'data-scene': '0',
          'aria-label': '分镜一：一句话开始',
        },
        children: [
          {
            tag: 'div',
            attrs: {
              class: 'scene-inner',
            },
            children: [
              {
                tag: 'div',
                attrs: {
                  class: 'reveal',
                  'data-beat': '0',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'eyebrow',
                      'data-edit': 's1-label',
                    },
                    children: ['日常使用'],
                  },
                  {
                    tag: 'h2',
                    attrs: {
                      class: 'headline',
                      'data-edit': 's1-title',
                    },
                    children: ['一句话，就能开始'],
                  },
                ],
              },
              {
                tag: 'div',
                attrs: {
                  class: 'brand-row reveal',
                  'data-beat': '0',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'brand',
                    },
                    children: [
                      {
                        tag: 'i',
                        attrs: {
                          class: 'brand-dot',
                        },
                        children: [],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's1-brand1',
                        },
                        children: ['ChatGPT'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'brand',
                    },
                    children: [
                      {
                        tag: 'i',
                        attrs: {
                          class: 'brand-dot',
                        },
                        children: [],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's1-brand2',
                        },
                        children: ['DeepSeek'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'brand',
                    },
                    children: [
                      {
                        tag: 'i',
                        attrs: {
                          class: 'brand-dot',
                        },
                        children: [],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's1-brand3',
                        },
                        children: ['豆包'],
                      },
                    ],
                  },
                ],
              },
              {
                tag: 'div',
                attrs: {
                  class: 'flow',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'flow-card reveal',
                      'data-beat': '1',
                    },
                    children: [
                      {
                        tag: 'div',
                        attrs: {
                          class: 'card-label',
                        },
                        children: [
                          {
                            tag: 'svg',
                            attrs: {
                              class: 'icon',
                            },
                            children: [
                              {
                                tag: 'use',
                                attrs: {
                                  href: '#i-chat',
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            tag: 'span',
                            attrs: {
                              'data-edit': 's1-input-label',
                            },
                            children: ['打开聊天框'],
                          },
                        ],
                      },
                      {
                        tag: 'div',
                        attrs: {
                          class: 'card-main',
                          'data-edit': 's1-input',
                        },
                        children: ['输入一句话'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'flow-arrow reveal',
                      'data-beat': '2',
                    },
                    children: [
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-arrow',
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'flow-card answer reveal',
                      'data-beat': '3',
                    },
                    children: [
                      {
                        tag: 'div',
                        attrs: {
                          class: 'card-label',
                        },
                        children: [
                          {
                            tag: 'svg',
                            attrs: {
                              class: 'icon',
                            },
                            children: [
                              {
                                tag: 'use',
                                attrs: {
                                  href: '#i-spark',
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            tag: 'span',
                            attrs: {
                              'data-edit': 's1-response-label',
                            },
                            children: ['AI 很快回应'],
                          },
                        ],
                      },
                      {
                        tag: 'div',
                        attrs: {
                          class: 'card-main',
                          'data-edit': 's1-response',
                        },
                        children: ['得到一个回答'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      name: 'AI 能做什么',
      duration: 16,
      beats: [
        {
          at: 0,
          label: '标题',
        },
        {
          at: 1.5,
          label: '写文章',
        },
        {
          at: 3.5,
          label: '总结资料',
        },
        {
          at: 5.5,
          label: '修改文案',
        },
        {
          at: 7.5,
          label: '解释问题',
        },
        {
          at: 10.5,
          label: '复杂任务：继续分析、逐步处理',
        },
      ],
      narration:
        '它可以帮我们写文章、总结资料、修改文案、解释问题。有时候，你给它一个比较复杂的任务，它也能继续往下分析和处理。',
      direction: '四种能力依次出现；复杂任务留在同页底部，最后补充。',
      tree: {
        tag: 'section',
        attrs: {
          class: 'scene s2',
          'data-scene': '1',
          'aria-label': '分镜二：AI 能做什么',
          'aria-hidden': 'true',
        },
        children: [
          {
            tag: 'div',
            attrs: {
              class: 'scene-inner',
            },
            children: [
              {
                tag: 'div',
                attrs: {
                  class: 'reveal',
                  'data-beat': '0',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'eyebrow',
                      'data-edit': 's2-label',
                    },
                    children: ['熟悉的能力'],
                  },
                  {
                    tag: 'h2',
                    attrs: {
                      class: 'headline',
                      'data-edit': 's2-title',
                    },
                    children: ['它能帮你做很多事'],
                  },
                ],
              },
              {
                tag: 'div',
                attrs: {
                  class: 'capabilities',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'capability reveal',
                      'data-beat': '1',
                    },
                    children: [
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-write',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's2-write',
                        },
                        children: ['写文章'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'capability reveal',
                      'data-beat': '2',
                    },
                    children: [
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-summary',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's2-summarize',
                        },
                        children: ['总结资料'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'capability reveal',
                      'data-beat': '3',
                    },
                    children: [
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-edit',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's2-rewrite',
                        },
                        children: ['修改文案'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'capability reveal',
                      'data-beat': '4',
                    },
                    children: [
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-question',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's2-explain',
                        },
                        children: ['解释问题'],
                      },
                    ],
                  },
                ],
              },
              {
                tag: 'div',
                attrs: {
                  class: 'complex-task reveal',
                  'data-beat': '5',
                },
                children: [
                  {
                    tag: 'span',
                    attrs: {
                      class: 'complex-tag',
                      'data-edit': 's2-complex',
                    },
                    children: ['复杂任务'],
                  },
                  {
                    tag: 'svg',
                    attrs: {
                      class: 'icon',
                    },
                    children: [
                      {
                        tag: 'use',
                        attrs: {
                          href: '#i-arrow',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    tag: 'span',
                    attrs: {
                      class: 'complex-detail',
                      'data-edit': 's2-complex-detail',
                    },
                    children: ['继续分析 · 逐步处理'],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      name: '中间发生了什么',
      duration: 11,
      beats: [
        {
          at: 0,
          label: '输入之后，回答之前；你的输入',
        },
        {
          at: 2,
          label: '右侧出现 AI 回答',
        },
        {
          at: 4.5,
          label: '中间问号与核心问题',
        },
      ],
      narration:
        '但如果再往里面追问一步：你输入这句话以后，到 AI 给出回答之前，中间到底发生了什么？这就是这一课要解决的问题。',
      direction: '左右先建立输入与回答，中间留白，再用问号把注意力收回来。',
      tree: {
        tag: 'section',
        attrs: {
          class: 'scene s3',
          'data-scene': '2',
          'aria-label': '分镜三：中间发生了什么',
          'aria-hidden': 'true',
        },
        children: [
          {
            tag: 'div',
            attrs: {
              class: 'scene-inner',
            },
            children: [
              {
                tag: 'h2',
                attrs: {
                  class: 'headline reveal',
                  'data-beat': '0',
                  'data-edit': 's3-title',
                },
                children: ['输入之后，回答之前'],
              },
              {
                tag: 'div',
                attrs: {
                  class: 'mystery-flow',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'endpoint reveal',
                      'data-beat': '0',
                    },
                    children: [
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-chat',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's3-input',
                        },
                        children: ['你的输入'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'mystery reveal',
                      'data-beat': '2',
                    },
                    children: [
                      {
                        tag: 'div',
                        attrs: {
                          class: 'mystery-line',
                        },
                        children: [],
                      },
                      {
                        tag: 'div',
                        attrs: {
                          class: 'mystery-box',
                          'data-edit': 's3-mark',
                        },
                        children: ['?'],
                      },
                      {
                        tag: 'div',
                        attrs: {
                          class: 'mystery-line',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'endpoint reveal',
                      'data-beat': '1',
                    },
                    children: [
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-spark',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's3-answer',
                        },
                        children: ['AI 回答'],
                      },
                    ],
                  },
                ],
              },
              {
                tag: 'p',
                attrs: {
                  class: 'big-question reveal',
                  'data-beat': '2',
                  'data-edit': 's3-question',
                },
                children: ['中间发生了什么？'],
              },
            ],
          },
        ],
      },
    },
    {
      name: '我们用的是产品',
      duration: 19,
      beats: [
        {
          at: 0,
          label: '你用的是 AI 产品',
        },
        {
          at: 2,
          label: '产品范围与三个产品名',
        },
        {
          at: 6,
          label: '聊天窗口',
        },
        {
          at: 8,
          label: '文件上传',
        },
        {
          at: 10,
          label: '联网搜索',
        },
        {
          at: 12,
          label: '语音对话',
        },
        {
          at: 15,
          label: '这些功能都属于产品',
        },
      ],
      narration:
        '首先，ChatGPT、DeepSeek、豆包，这些都是一个个完整的 AI 产品。我们看到的聊天窗口、文件上传、联网搜索、语音对话，以及各种功能和按钮，都属于产品的一部分。',
      direction: '用一个大边框表示完整产品；功能在边框内逐项出现，强调归属。',
      tree: {
        tag: 'section',
        attrs: {
          class: 'scene s4',
          'data-scene': '3',
          'aria-label': '分镜四：我们使用的是 AI 产品',
          'aria-hidden': 'true',
        },
        children: [
          {
            tag: 'div',
            attrs: {
              class: 'scene-inner',
            },
            children: [
              {
                tag: 'div',
                attrs: {
                  class: 'reveal',
                  'data-beat': '0',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'eyebrow',
                      'data-edit': 's4-label',
                    },
                    children: ['先分清一个概念'],
                  },
                  {
                    tag: 'h2',
                    attrs: {
                      class: 'headline',
                      'data-edit': 's4-title',
                    },
                    children: ['你用的是 AI 产品'],
                  },
                ],
              },
              {
                tag: 'div',
                attrs: {
                  class: 'product-frame reveal',
                  'data-beat': '1',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'frame-heading',
                    },
                    children: [
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-product',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's4-frame',
                        },
                        children: ['完整的 AI 产品'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'brand-row',
                    },
                    children: [
                      {
                        tag: 'div',
                        attrs: {
                          class: 'brand',
                        },
                        children: [
                          {
                            tag: 'i',
                            attrs: {
                              class: 'brand-dot',
                            },
                            children: [],
                          },
                          {
                            tag: 'span',
                            attrs: {
                              'data-edit': 's4-brand1',
                            },
                            children: ['ChatGPT'],
                          },
                        ],
                      },
                      {
                        tag: 'div',
                        attrs: {
                          class: 'brand',
                        },
                        children: [
                          {
                            tag: 'i',
                            attrs: {
                              class: 'brand-dot',
                            },
                            children: [],
                          },
                          {
                            tag: 'span',
                            attrs: {
                              'data-edit': 's4-brand2',
                            },
                            children: ['DeepSeek'],
                          },
                        ],
                      },
                      {
                        tag: 'div',
                        attrs: {
                          class: 'brand',
                        },
                        children: [
                          {
                            tag: 'i',
                            attrs: {
                              class: 'brand-dot',
                            },
                            children: [],
                          },
                          {
                            tag: 'span',
                            attrs: {
                              'data-edit': 's4-brand3',
                            },
                            children: ['豆包'],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'feature-row',
                    },
                    children: [
                      {
                        tag: 'div',
                        attrs: {
                          class: 'feature reveal',
                          'data-beat': '2',
                        },
                        children: [
                          {
                            tag: 'svg',
                            attrs: {
                              class: 'icon',
                            },
                            children: [
                              {
                                tag: 'use',
                                attrs: {
                                  href: '#i-chat',
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            tag: 'span',
                            attrs: {
                              'data-edit': 's4-chat',
                            },
                            children: ['聊天窗口'],
                          },
                        ],
                      },
                      {
                        tag: 'div',
                        attrs: {
                          class: 'feature reveal',
                          'data-beat': '3',
                        },
                        children: [
                          {
                            tag: 'svg',
                            attrs: {
                              class: 'icon',
                            },
                            children: [
                              {
                                tag: 'use',
                                attrs: {
                                  href: '#i-file',
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            tag: 'span',
                            attrs: {
                              'data-edit': 's4-file',
                            },
                            children: ['文件上传'],
                          },
                        ],
                      },
                      {
                        tag: 'div',
                        attrs: {
                          class: 'feature reveal',
                          'data-beat': '4',
                        },
                        children: [
                          {
                            tag: 'svg',
                            attrs: {
                              class: 'icon',
                            },
                            children: [
                              {
                                tag: 'use',
                                attrs: {
                                  href: '#i-search',
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            tag: 'span',
                            attrs: {
                              'data-edit': 's4-search',
                            },
                            children: ['联网搜索'],
                          },
                        ],
                      },
                      {
                        tag: 'div',
                        attrs: {
                          class: 'feature reveal',
                          'data-beat': '5',
                        },
                        children: [
                          {
                            tag: 'svg',
                            attrs: {
                              class: 'icon',
                            },
                            children: [
                              {
                                tag: 'use',
                                attrs: {
                                  href: '#i-mic',
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            tag: 'span',
                            attrs: {
                              'data-edit': 's4-voice',
                            },
                            children: ['语音对话'],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                tag: 'div',
                attrs: {
                  class: 'product-note reveal',
                  'data-beat': '6',
                  'data-edit': 's4-note',
                },
                children: ['这些功能，都属于产品的一部分'],
              },
            ],
          },
        ],
      },
    },
    {
      name: '背后是大模型',
      duration: 14,
      beats: [
        {
          at: 0,
          label: '产品外框与标题',
        },
        {
          at: 3,
          label: '产品内部出现大模型',
        },
        {
          at: 7,
          label: '理解内容',
        },
        {
          at: 9.5,
          label: '生成回答',
        },
      ],
      narration:
        '而这些产品能理解我们的内容、生成回答，背后的核心能力，就是大模型。',
      direction:
        '沿用产品外框，把视线从功能层转向内部的大模型，再补上理解与生成。',
      tree: {
        tag: 'section',
        attrs: {
          class: 'scene s5',
          'data-scene': '4',
          'aria-label': '分镜五：大模型是核心能力',
          'aria-hidden': 'true',
        },
        children: [
          {
            tag: 'div',
            attrs: {
              class: 'scene-inner',
            },
            children: [
              {
                tag: 'div',
                attrs: {
                  class: 'reveal',
                  'data-beat': '0',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'eyebrow',
                      'data-edit': 's5-label',
                    },
                    children: ['再看产品背后'],
                  },
                  {
                    tag: 'h2',
                    attrs: {
                      class: 'headline',
                      'data-edit': 's5-title',
                    },
                    children: ['核心能力，来自大模型'],
                  },
                ],
              },
              {
                tag: 'div',
                attrs: {
                  class: 'model-product reveal',
                  'data-beat': '0',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'model-product-header',
                    },
                    children: [
                      {
                        tag: 'div',
                        attrs: {
                          class: 'model-product-title',
                        },
                        children: [
                          {
                            tag: 'svg',
                            attrs: {
                              class: 'icon',
                            },
                            children: [
                              {
                                tag: 'use',
                                attrs: {
                                  href: '#i-product',
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            tag: 'span',
                            attrs: {
                              'data-edit': 's5-product',
                            },
                            children: ['AI 产品'],
                          },
                        ],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          class: 'surface-functions',
                          'data-edit': 's5-features',
                        },
                        children: ['聊天 · 文件 · 搜索 · 语音'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'model-core reveal',
                      'data-beat': '1',
                    },
                    children: [
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon core-symbol',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-core',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: 'div',
                        attrs: {
                          class: 'core-copy',
                        },
                        children: [
                          {
                            tag: 'div',
                            attrs: {
                              class: 'core-overline',
                              'data-edit': 's5-core-label',
                            },
                            children: ['背后的核心能力'],
                          },
                          {
                            tag: 'div',
                            attrs: {
                              class: 'core-title',
                              'data-edit': 's5-core',
                            },
                            children: ['大模型'],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'core-functions',
                    },
                    children: [
                      {
                        tag: 'span',
                        attrs: {
                          class: 'reveal',
                          'data-beat': '2',
                          'data-edit': 's5-understand',
                        },
                        children: ['理解内容'],
                      },
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon reveal',
                          'data-beat': '3',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-arrow',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          class: 'reveal',
                          'data-beat': '3',
                          'data-edit': 's5-generate',
                        },
                        children: ['生成回答'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      name: '记住这个关系',
      duration: 11,
      beats: [
        {
          at: 0,
          label: '标题与我们',
        },
        {
          at: 1.5,
          label: '我们直接使用 AI 产品',
        },
        {
          at: 4.5,
          label: '大模型向产品提供核心能力',
        },
        {
          at: 7.5,
          label: '最后一句关系总结',
        },
      ],
      narration:
        '所以这里可以先建立一个很简单的关系：我们直接使用的是 AI 产品，而大模型是这些产品背后的核心能力。',
      direction:
        '先呈现我们与产品的关系，再从右侧引入大模型；最后停留在关系总结。',
      tree: {
        tag: 'section',
        attrs: {
          class: 'scene s6',
          'data-scene': '5',
          'aria-label': '分镜六：产品与模型的关系',
          'aria-hidden': 'true',
        },
        children: [
          {
            tag: 'div',
            attrs: {
              class: 'scene-inner',
            },
            children: [
              {
                tag: 'div',
                attrs: {
                  class: 'reveal',
                  'data-beat': '0',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'eyebrow',
                      'data-edit': 's6-label',
                    },
                    children: ['建立一个简单的关系'],
                  },
                  {
                    tag: 'h2',
                    attrs: {
                      class: 'headline',
                      'data-edit': 's6-title',
                    },
                    children: ['我们用产品，模型提供能力'],
                  },
                ],
              },
              {
                tag: 'div',
                attrs: {
                  class: 'relationship',
                },
                children: [
                  {
                    tag: 'div',
                    attrs: {
                      class: 'we-node reveal',
                      'data-beat': '0',
                    },
                    children: [
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-user',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's6-we',
                        },
                        children: ['我们'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'relation-arrow reveal',
                      'data-beat': '1',
                    },
                    children: [
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's6-use',
                        },
                        children: ['直接使用'],
                      },
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-arrow',
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'relation-node reveal',
                      'data-beat': '1',
                    },
                    children: [
                      {
                        tag: 'span',
                        attrs: {
                          class: 'relation-title',
                          'data-edit': 's6-product',
                        },
                        children: ['AI 产品'],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          class: 'relation-sub',
                          'data-edit': 's6-product-sub',
                        },
                        children: ['我们操作的入口'],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'relation-arrow reveal',
                      'data-beat': '2',
                    },
                    children: [
                      {
                        tag: 'span',
                        attrs: {
                          'data-edit': 's6-provide',
                        },
                        children: ['提供核心能力'],
                      },
                      {
                        tag: 'svg',
                        attrs: {
                          class: 'icon',
                        },
                        children: [
                          {
                            tag: 'use',
                            attrs: {
                              href: '#i-back',
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    attrs: {
                      class: 'relation-node core reveal',
                      'data-beat': '2',
                    },
                    children: [
                      {
                        tag: 'span',
                        attrs: {
                          class: 'relation-title',
                          'data-edit': 's6-model',
                        },
                        children: ['大模型'],
                      },
                      {
                        tag: 'span',
                        attrs: {
                          class: 'relation-sub',
                          'data-edit': 's6-model-sub',
                        },
                        children: ['理解内容 · 生成回答'],
                      },
                    ],
                  },
                ],
              },
              {
                tag: 'div',
                attrs: {
                  class: 'final-line reveal',
                  'data-beat': '3',
                },
                children: [
                  {
                    tag: 'span',
                    attrs: {
                      'data-edit': 's6-final1',
                    },
                    children: ['用的是'],
                  },
                  ' ',
                  {
                    tag: 'strong',
                    attrs: {
                      'data-edit': 's6-final2',
                    },
                    children: ['产品'],
                  },
                  {
                    tag: 'span',
                    attrs: {
                      'data-edit': 's6-final3',
                    },
                    children: ['，背后是'],
                  },
                  ' ',
                  {
                    tag: 'strong',
                    attrs: {
                      'data-edit': 's6-final4',
                    },
                    children: ['大模型'],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};
