// Source selections are in seconds; audio cuts are original 30 fps frames.
// User chose actual spoken version over the earlier 45-paragraph script.
export type Shot = {at:number;kind:string;file?:string;sourceStart?:number;sourceEnd?:number|null;zoom?:number;cx?:number;cy?:number;label?:string;mark?:number[]|null};
export type Scene = {id:string;title:string;chapter:string;sourceStart:number;sourceEnd:number;sourceStartFrame:number;sourceEndFrame:number;durationInFrames:number;audio:{sourceStart:number;sourceEnd:number}[];shots:Shot[]};
export const FPS=30;
export const scenes:Scene[] = [
  {
    "id": "s01",
    "title": "同一份资料，两种结果",
    "chapter": "开场",
    "sourceStart": 62.02,
    "sourceEnd": 69.8,
    "shots": [
      {
        "at": 62.02,
        "kind": "opening",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 1861,
        "sourceEnd": 2094
      }
    ],
    "durationInFrames": 233,
    "sourceStartFrame": 1861,
    "sourceEndFrame": 2094
  },
  {
    "id": "s02",
    "title": "差别在做法",
    "chapter": "开场",
    "sourceStart": 69.8,
    "sourceEnd": 76.82,
    "shots": [
      {
        "at": 69.8,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 2094,
        "sourceEnd": 2305
      }
    ],
    "durationInFrames": 211,
    "sourceStartFrame": 2094,
    "sourceEndFrame": 2305
  },
  {
    "id": "s03",
    "title": "准备产品资料",
    "chapter": "一句话生成",
    "sourceStart": 100.31,
    "sourceEnd": 115.15,
    "shots": [
      {
        "at": 100.31,
        "kind": "screen",
        "file": "01",
        "sourceStart": 12,
        "sourceEnd": 18,
        "zoom": 1.5,
        "cx": 0.59,
        "cy": 0.43,
        "label": "产品资料",
        "mark": null
      },
      {
        "at": 107.13,
        "kind": "screen",
        "file": "01",
        "sourceStart": 16,
        "sourceEnd": null,
        "zoom": 1.8,
        "cx": 0.66,
        "cy": 0.39,
        "label": "三份产品资料",
        "mark": null
      },
      {
        "at": 109.39,
        "kind": "screen",
        "file": "08",
        "sourceStart": 68,
        "sourceEnd": null,
        "zoom": 1.65,
        "cx": 0.65,
        "cy": 0.52,
        "label": "产品照片",
        "mark": null
      },
      {
        "at": 111.33,
        "kind": "screen",
        "file": "03",
        "sourceStart": 202.5,
        "sourceEnd": null,
        "zoom": 1.7,
        "cx": 0.52,
        "cy": 0.43,
        "label": "公司 PPT 模板",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 3009,
        "sourceEnd": 3454
      }
    ],
    "durationInFrames": 445,
    "sourceStartFrame": 3009,
    "sourceEndFrame": 3454
  },
  {
    "id": "s04",
    "title": "一句话生成",
    "chapter": "一句话生成",
    "sourceStart": 115.57,
    "sourceEnd": 125.29,
    "shots": [
      {
        "at": 115.57,
        "kind": "screen",
        "file": "01",
        "sourceStart": 20,
        "sourceEnd": 27,
        "zoom": 1.5,
        "cx": 0.5,
        "cy": 0.78,
        "label": "更多技能 → PPT",
        "mark": null
      },
      {
        "at": 120.79,
        "kind": "screen",
        "file": "01",
        "sourceStart": 12,
        "sourceEnd": 18,
        "zoom": 1.5,
        "cx": 0.6,
        "cy": 0.43,
        "label": "上传资料",
        "mark": null
      },
      {
        "at": 122.45,
        "kind": "screen",
        "file": "01",
        "sourceStart": 30,
        "sourceEnd": 36,
        "zoom": 1.9,
        "cx": 0.5,
        "cy": 0.83,
        "label": "帮我做个产品宣传 PPT",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 3467,
        "sourceEnd": 3759
      }
    ],
    "durationInFrames": 292,
    "sourceStartFrame": 3467,
    "sourceEndFrame": 3759
  },
  {
    "id": "s05",
    "title": "看看第一版",
    "chapter": "一句话生成",
    "sourceStart": 126.33,
    "sourceEnd": 143.15,
    "shots": [
      {
        "at": 126.33,
        "kind": "screen",
        "file": "02",
        "sourceStart": 5,
        "sourceEnd": 14,
        "zoom": 1.6,
        "cx": 0.78,
        "cy": 0.57,
        "label": "一句话生成的结果",
        "mark": null
      },
      {
        "at": 133.13,
        "kind": "screen",
        "file": "02",
        "sourceStart": 25,
        "sourceEnd": null,
        "zoom": 1.75,
        "cx": 0.78,
        "cy": 0.58,
        "label": "内容基本准确",
        "mark": null
      },
      {
        "at": 136.13,
        "kind": "screen",
        "file": "02",
        "sourceStart": 33,
        "sourceEnd": null,
        "zoom": 2,
        "cx": 0.83,
        "cy": 0.58,
        "label": "手机随手拍的产品图",
        "mark": [
          0.83,
          0.5,
          0.13,
          0.3
        ]
      },
      {
        "at": 138.11,
        "kind": "screen",
        "file": "02",
        "sourceStart": 25,
        "sourceEnd": null,
        "zoom": 1.8,
        "cx": 0.78,
        "cy": 0.58,
        "label": "缺少动画与设计",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 3790,
        "sourceEnd": 4294
      }
    ],
    "durationInFrames": 504,
    "sourceStartFrame": 3790,
    "sourceEndFrame": 4294
  },
  {
    "id": "s06",
    "title": "五步方法",
    "chapter": "方法总览",
    "sourceStart": 149.73,
    "sourceEnd": 167.07,
    "shots": [
      {
        "at": 149.73,
        "kind": "presenter",
        "label": ""
      },
      {
        "at": 160.35,
        "kind": "presenter-steps",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 4492,
        "sourceEnd": 4676
      },
      {
        "sourceStart": 4810,
        "sourceEnd": 5012
      }
    ],
    "durationInFrames": 386,
    "sourceStartFrame": 4492,
    "sourceEndFrame": 5012
  },
  {
    "id": "s07",
    "title": "第一步：定大纲",
    "chapter": "01 定大纲",
    "sourceStart": 167.73,
    "sourceEnd": 176.41,
    "shots": [
      {
        "at": 167.73,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 5032,
        "sourceEnd": 5292
      }
    ],
    "durationInFrames": 260,
    "sourceStartFrame": 5032,
    "sourceEndFrame": 5292
  },
  {
    "id": "s08",
    "title": "先让 AI 出大纲",
    "chapter": "01 定大纲",
    "sourceStart": 176.41,
    "sourceEnd": 184.15,
    "shots": [
      {
        "at": 176.41,
        "kind": "screen",
        "file": "03",
        "sourceStart": 4,
        "sourceEnd": 18,
        "zoom": 1.2,
        "cx": 0.5,
        "cy": 0.6,
        "label": "新开对话 · 上传资料",
        "mark": null
      },
      {
        "at": 181.41,
        "kind": "screen",
        "file": "03",
        "sourceStart": 40,
        "sourceEnd": null,
        "zoom": 1.7,
        "cx": 0.49,
        "cy": 0.79,
        "label": "先出大纲",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 5292,
        "sourceEnd": 5524
      }
    ],
    "durationInFrames": 232,
    "sourceStartFrame": 5292,
    "sourceEndFrame": 5524
  },
  {
    "id": "s09",
    "title": "提示词的五块内容",
    "chapter": "01 定大纲",
    "sourceStart": 184.57,
    "sourceEnd": 205.01,
    "shots": [
      {
        "at": 184.57,
        "kind": "screen",
        "file": "03",
        "sourceStart": 41,
        "sourceEnd": null,
        "zoom": 1.8,
        "cx": 0.49,
        "cy": 0.79,
        "label": "任务",
        "mark": [
          0.18,
          0.74,
          0.58,
          0.025
        ]
      },
      {
        "at": 189.47,
        "kind": "screen",
        "file": "03",
        "sourceStart": 41,
        "sourceEnd": null,
        "zoom": 1.9,
        "cx": 0.49,
        "cy": 0.8,
        "label": "背景",
        "mark": [
          0.18,
          0.767,
          0.58,
          0.027
        ]
      },
      {
        "at": 194.95,
        "kind": "screen",
        "file": "03",
        "sourceStart": 41,
        "sourceEnd": null,
        "zoom": 1.9,
        "cx": 0.49,
        "cy": 0.82,
        "label": "目标",
        "mark": [
          0.18,
          0.797,
          0.58,
          0.028
        ]
      },
      {
        "at": 199.17,
        "kind": "screen",
        "file": "03",
        "sourceStart": 41,
        "sourceEnd": null,
        "zoom": 1.9,
        "cx": 0.49,
        "cy": 0.84,
        "label": "输出",
        "mark": [
          0.18,
          0.827,
          0.58,
          0.028
        ]
      },
      {
        "at": 201.05,
        "kind": "screen",
        "file": "03",
        "sourceStart": 41,
        "sourceEnd": null,
        "zoom": 1.9,
        "cx": 0.49,
        "cy": 0.86,
        "label": "要求",
        "mark": [
          0.18,
          0.858,
          0.58,
          0.065
        ]
      }
    ],
    "audio": [
      {
        "sourceStart": 5537,
        "sourceEnd": 5730
      },
      {
        "sourceStart": 5785,
        "sourceEnd": 6150
      }
    ],
    "durationInFrames": 558,
    "sourceStartFrame": 5537,
    "sourceEndFrame": 6150
  },
  {
    "id": "s10",
    "title": "检查并确认大纲",
    "chapter": "01 定大纲",
    "sourceStart": 205.79,
    "sourceEnd": 215.29,
    "shots": [
      {
        "at": 205.79,
        "kind": "screen",
        "file": "03",
        "sourceStart": 92,
        "sourceEnd": 115,
        "zoom": 1.5,
        "cx": 0.49,
        "cy": 0.42,
        "label": "逐页检查大纲",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 6174,
        "sourceEnd": 6459
      }
    ],
    "durationInFrames": 285,
    "sourceStartFrame": 6174,
    "sourceEndFrame": 6459
  },
  {
    "id": "s11",
    "title": "先定大纲，再动手",
    "chapter": "01 定大纲",
    "sourceStart": 216.09,
    "sourceEnd": 221.87,
    "shots": [
      {
        "at": 216.09,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 6483,
        "sourceEnd": 6656
      }
    ],
    "durationInFrames": 173,
    "sourceStartFrame": 6483,
    "sourceEndFrame": 6656
  },
  {
    "id": "s12",
    "title": "第二步：套模板",
    "chapter": "02 套模板",
    "sourceStart": 222.85,
    "sourceEnd": 238.26,
    "shots": [
      {
        "at": 222.85,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 6686,
        "sourceEnd": 6871
      },
      {
        "sourceStart": 6945,
        "sourceEnd": 7148
      }
    ],
    "durationInFrames": 388,
    "sourceStartFrame": 6686,
    "sourceEndFrame": 7148
  },
  {
    "id": "s13",
    "title": "用公司模板",
    "chapter": "02 套模板",
    "sourceStart": 238.26,
    "sourceEnd": 247.88,
    "shots": [
      {
        "at": 238.26,
        "kind": "screen",
        "file": "03",
        "sourceStart": 201,
        "sourceEnd": 206,
        "zoom": 1.45,
        "cx": 0.5,
        "cy": 0.46,
        "label": "上传公司模板",
        "mark": null
      },
      {
        "at": 241.72,
        "kind": "screen",
        "file": "03",
        "sourceStart": 215,
        "sourceEnd": 224,
        "zoom": 1.7,
        "cx": 0.49,
        "cy": 0.83,
        "label": "logo · 配色 · 字体 · 版式",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 7148,
        "sourceEnd": 7436
      }
    ],
    "durationInFrames": 288,
    "sourceStartFrame": 7148,
    "sourceEndFrame": 7436
  },
  {
    "id": "s14",
    "title": "文字可以直接编辑",
    "chapter": "02 套模板",
    "sourceStart": 248.6,
    "sourceEnd": 255.56,
    "shots": [
      {
        "at": 248.6,
        "kind": "screen",
        "file": "03",
        "sourceStart": 282,
        "sourceEnd": 289,
        "zoom": 1.25,
        "cx": 0.57,
        "cy": 0.58,
        "label": "检查公司模板",
        "mark": null
      },
      {
        "at": 252.12,
        "kind": "screen",
        "file": "03",
        "sourceStart": 265,
        "sourceEnd": 275,
        "zoom": 1.2,
        "cx": 0.57,
        "cy": 0.55,
        "label": "文字可编辑",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 7458,
        "sourceEnd": 7667
      }
    ],
    "durationInFrames": 209,
    "sourceStartFrame": 7458,
    "sourceEndFrame": 7667
  },
  {
    "id": "s15",
    "title": "没有公司模板怎么办",
    "chapter": "02 套模板",
    "sourceStart": 256.2,
    "sourceEnd": 260.84,
    "shots": [
      {
        "at": 256.2,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 7686,
        "sourceEnd": 7825
      }
    ],
    "durationInFrames": 139,
    "sourceStartFrame": 7686,
    "sourceEndFrame": 7825
  },
  {
    "id": "s16",
    "title": "Skill 像一本工作手册",
    "chapter": "02 套模板",
    "sourceStart": 260.84,
    "sourceEnd": 275.14,
    "shots": [
      {
        "at": 260.84,
        "kind": "handbook",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 7825,
        "sourceEnd": 8254
      }
    ],
    "durationInFrames": 429,
    "sourceStartFrame": 7825,
    "sourceEndFrame": 8254
  },
  {
    "id": "s17",
    "title": "我们已经用过 Skill",
    "chapter": "02 套模板",
    "sourceStart": 275.7,
    "sourceEnd": 283.18,
    "shots": [
      {
        "at": 275.7,
        "kind": "screen",
        "file": "01",
        "sourceStart": 20,
        "sourceEnd": 27,
        "zoom": 1.6,
        "cx": 0.49,
        "cy": 0.82,
        "label": "更多技能 → PPT",
        "mark": null
      },
      {
        "at": 280.16,
        "kind": "screen",
        "file": "01",
        "sourceStart": 26.4,
        "sourceEnd": null,
        "zoom": 1.8,
        "cx": 0.49,
        "cy": 0.82,
        "label": "豆包自带的 PPT Skill",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 8271,
        "sourceEnd": 8495
      }
    ],
    "durationInFrames": 224,
    "sourceStartFrame": 8271,
    "sourceEndFrame": 8495
  },
  {
    "id": "s18",
    "title": "安装别人的 Skill",
    "chapter": "02 套模板",
    "sourceStart": 285.74,
    "sourceEnd": 303.24,
    "shots": [
      {
        "at": 285.74,
        "kind": "presenter",
        "label": ""
      },
      {
        "at": 293.08,
        "kind": "install",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 8572,
        "sourceEnd": 9097
      }
    ],
    "durationInFrames": 525,
    "sourceStartFrame": 8572,
    "sourceEndFrame": 9097
  },
  {
    "id": "s19",
    "title": "调用 guizang Skill",
    "chapter": "02 套模板",
    "sourceStart": 307.03,
    "sourceEnd": 324.17,
    "shots": [
      {
        "at": 307.03,
        "kind": "screen",
        "file": "04-1",
        "sourceStart": 42,
        "sourceEnd": null,
        "zoom": 1.8,
        "cx": 0.49,
        "cy": 0.86,
        "label": "已安装，可以直接调用",
        "mark": null
      },
      {
        "at": 313.65,
        "kind": "screen",
        "file": "04-1",
        "sourceStart": 47,
        "sourceEnd": 55,
        "zoom": 1.8,
        "cx": 0.49,
        "cy": 0.82,
        "label": "用 guizang-ppt-skill",
        "mark": null
      },
      {
        "at": 318.85,
        "kind": "screen",
        "file": "04-1",
        "sourceStart": 60,
        "sourceEnd": 77,
        "zoom": 1.8,
        "cx": 0.49,
        "cy": 0.84,
        "label": "只换版式 · 保持大纲内容",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 9211,
        "sourceEnd": 9276
      },
      {
        "sourceStart": 9410,
        "sourceEnd": 9725
      }
    ],
    "durationInFrames": 380,
    "sourceStartFrame": 9211,
    "sourceEndFrame": 9725
  },
  {
    "id": "s20",
    "title": "选择主题色",
    "chapter": "02 套模板",
    "sourceStart": 325.03,
    "sourceEnd": 341.52,
    "shots": [
      {
        "at": 325.03,
        "kind": "screen",
        "file": "04-2",
        "sourceStart": 2,
        "sourceEnd": 8,
        "zoom": 1.5,
        "cx": 0.5,
        "cy": 0.46,
        "label": "电子杂志风",
        "mark": null
      },
      {
        "at": 329.83,
        "kind": "screen",
        "file": "04-2",
        "sourceStart": 9,
        "sourceEnd": 16,
        "zoom": 1.6,
        "cx": 0.5,
        "cy": 0.57,
        "label": "五套主题色",
        "mark": null
      },
      {
        "at": 332.03,
        "kind": "screen",
        "file": "04-2",
        "sourceStart": 17.5,
        "sourceEnd": null,
        "zoom": 1.7,
        "cx": 0.52,
        "cy": 0.67,
        "label": "墨水经典",
        "mark": null
      },
      {
        "at": 338.2,
        "kind": "screen",
        "file": "04-2",
        "sourceStart": 17.5,
        "sourceEnd": null,
        "zoom": 1.85,
        "cx": 0.52,
        "cy": 0.69,
        "label": "墨黑 + 暖米白",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 9751,
        "sourceEnd": 10023
      },
      {
        "sourceStart": 10090,
        "sourceEnd": 10096
      },
      {
        "sourceStart": 10146,
        "sourceEnd": 10246
      }
    ],
    "durationInFrames": 378,
    "sourceStartFrame": 9751,
    "sourceEndFrame": 10246
  },
  {
    "id": "s21",
    "title": "打开网页版 PPT",
    "chapter": "02 套模板",
    "sourceStart": 341.92,
    "sourceEnd": 351.34,
    "shots": [
      {
        "at": 341.92,
        "kind": "screen",
        "file": "05",
        "sourceStart": 10,
        "sourceEnd": 17,
        "zoom": 1.45,
        "cx": 0.5,
        "cy": 0.48,
        "label": "下载压缩包",
        "mark": null
      },
      {
        "at": 345.6,
        "kind": "screen",
        "file": "05",
        "sourceStart": 27,
        "sourceEnd": 40,
        "zoom": 1.4,
        "cx": 0.55,
        "cy": 0.46,
        "label": "解压 → index.html",
        "mark": null
      },
      {
        "at": 348.86,
        "kind": "screen",
        "file": "05",
        "sourceStart": 41,
        "sourceEnd": 49,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "浏览器翻页预览",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 10258,
        "sourceEnd": 10540
      }
    ],
    "durationInFrames": 282,
    "sourceStartFrame": 10258,
    "sourceEndFrame": 10540
  },
  {
    "id": "s22",
    "title": "版式更有设计感",
    "chapter": "02 套模板",
    "sourceStart": 364.06,
    "sourceEnd": 372.98,
    "shots": [
      {
        "at": 364.06,
        "kind": "screen",
        "file": "05",
        "sourceStart": 42,
        "sourceEnd": 51,
        "zoom": 1.05,
        "cx": 0.5,
        "cy": 0.53,
        "label": "更大的标题",
        "mark": null
      },
      {
        "at": 367.88,
        "kind": "screen",
        "file": "05",
        "sourceStart": 56,
        "sourceEnd": 65,
        "zoom": 1.05,
        "cx": 0.5,
        "cy": 0.53,
        "label": "大数字 · 深浅交替",
        "mark": null
      },
      {
        "at": 371.52,
        "kind": "screen",
        "file": "05",
        "sourceStart": 76,
        "sourceEnd": 80,
        "zoom": 1.05,
        "cx": 0.5,
        "cy": 0.53,
        "label": "留白",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 10922,
        "sourceEnd": 11189
      }
    ],
    "durationInFrames": 267,
    "sourceStartFrame": 10922,
    "sourceEndFrame": 11189
  },
  {
    "id": "s23",
    "title": "仍要保留公司的风格",
    "chapter": "02 套模板",
    "sourceStart": 372.98,
    "sourceEnd": 386.06,
    "shots": [
      {
        "at": 372.98,
        "kind": "screen",
        "file": "05",
        "sourceStart": 62.5,
        "sourceEnd": null,
        "zoom": 1.18,
        "cx": 0.65,
        "cy": 0.58,
        "label": "照片被截断",
        "mark": [
          0.58,
          0.39,
          0.29,
          0.48
        ]
      },
      {
        "at": 375.54,
        "kind": "screen",
        "file": "05",
        "sourceStart": 82.5,
        "sourceEnd": null,
        "zoom": 1.05,
        "cx": 0.5,
        "cy": 0.53,
        "label": "配色发生了变化",
        "mark": null
      },
      {
        "at": 377.1,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 11189,
        "sourceEnd": 11582
      }
    ],
    "durationInFrames": 393,
    "sourceStartFrame": 11189,
    "sourceEndFrame": 11582
  },
  {
    "id": "s24",
    "title": "第三步：调版式",
    "chapter": "03 调版式",
    "sourceStart": 387.82,
    "sourceEnd": 399.88,
    "shots": [
      {
        "at": 387.82,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 11635,
        "sourceEnd": 11996
      }
    ],
    "durationInFrames": 361,
    "sourceStartFrame": 11635,
    "sourceEndFrame": 11996
  },
  {
    "id": "s25",
    "title": "先定设计方向",
    "chapter": "03 调版式",
    "sourceStart": 402.84,
    "sourceEnd": 420.78,
    "shots": [
      {
        "at": 402.84,
        "kind": "screen",
        "file": "06",
        "sourceStart": 43,
        "sourceEnd": 54,
        "zoom": 1.8,
        "cx": 0.49,
        "cy": 0.83,
        "label": "先定方向",
        "mark": null
      },
      {
        "at": 408.9,
        "kind": "screen",
        "file": "06",
        "sourceStart": 58,
        "sourceEnd": null,
        "zoom": 1.6,
        "cx": 0.51,
        "cy": 0.81,
        "label": "记住什么 · 参考谁 · 重点页",
        "mark": null
      },
      {
        "at": 415.84,
        "kind": "screen",
        "file": "06",
        "sourceStart": 88,
        "sourceEnd": 106,
        "zoom": 1.5,
        "cx": 0.5,
        "cy": 0.43,
        "label": "检查方案",
        "mark": null
      },
      {
        "at": 418.94,
        "kind": "screen",
        "file": "06",
        "sourceStart": 103,
        "sourceEnd": null,
        "zoom": 1.5,
        "cx": 0.5,
        "cy": 0.4,
        "label": "方向定了，再做素材",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 12085,
        "sourceEnd": 12623
      }
    ],
    "durationInFrames": 538,
    "sourceStartFrame": 12085,
    "sourceEndFrame": 12623
  },
  {
    "id": "s26",
    "title": "列素材清单",
    "chapter": "03 调版式",
    "sourceStart": 421.68,
    "sourceEnd": 432.96,
    "shots": [
      {
        "at": 421.68,
        "kind": "screen",
        "file": "07",
        "sourceStart": 17,
        "sourceEnd": 25,
        "zoom": 1.8,
        "cx": 0.49,
        "cy": 0.84,
        "label": "每页需要什么图",
        "mark": null
      },
      {
        "at": 426.76,
        "kind": "screen",
        "file": "07",
        "sourceStart": 38,
        "sourceEnd": 67,
        "zoom": 1.5,
        "cx": 0.49,
        "cy": 0.49,
        "label": "检查素材清单",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 12650,
        "sourceEnd": 12989
      }
    ],
    "durationInFrames": 339,
    "sourceStartFrame": 12650,
    "sourceEndFrame": 12989
  },
  {
    "id": "s27",
    "title": "制作产品主视觉",
    "chapter": "03 调版式",
    "sourceStart": 433.56,
    "sourceEnd": 447.04,
    "shots": [
      {
        "at": 433.56,
        "kind": "screen",
        "file": "08",
        "sourceStart": 68,
        "sourceEnd": null,
        "zoom": 1.7,
        "cx": 0.65,
        "cy": 0.51,
        "label": "手机拍摄原图",
        "mark": null
      },
      {
        "at": 439.02,
        "kind": "screen",
        "file": "08",
        "sourceStart": 32,
        "sourceEnd": 43,
        "zoom": 1.45,
        "cx": 0.5,
        "cy": 0.78,
        "label": "纯黑背景 · 侧面打光",
        "mark": null
      },
      {
        "at": 443.62,
        "kind": "screen",
        "file": "08",
        "sourceStart": 43,
        "sourceEnd": null,
        "zoom": 1.6,
        "cx": 0.49,
        "cy": 0.83,
        "label": "外形和 logo 不能改",
        "mark": [
          0.25,
          0.79,
          0.62,
          0.08
        ]
      }
    ],
    "audio": [
      {
        "sourceStart": 13007,
        "sourceEnd": 13411
      }
    ],
    "durationInFrames": 404,
    "sourceStartFrame": 13007,
    "sourceEndFrame": 13411
  },
  {
    "id": "s28",
    "title": "主视觉效果",
    "chapter": "03 调版式",
    "sourceStart": 447.54,
    "sourceEnd": 454.94,
    "shots": [
      {
        "at": 447.54,
        "kind": "screen",
        "file": "08",
        "sourceStart": 87,
        "sourceEnd": 94,
        "zoom": 1.6,
        "cx": 0.5,
        "cy": 0.57,
        "label": "生成的两张主视觉",
        "mark": null
      },
      {
        "at": 451.18,
        "kind": "image",
        "file": "ai-ppt/image-03.jpg",
        "label": "背景干净，产品更有质感"
      }
    ],
    "audio": [
      {
        "sourceStart": 13426,
        "sourceEnd": 13648
      }
    ],
    "durationInFrames": 222,
    "sourceStartFrame": 13426,
    "sourceEndFrame": 13648
  },
  {
    "id": "s29",
    "title": "制作细节特写",
    "chapter": "03 调版式",
    "sourceStart": 455.42,
    "sourceEnd": 472.56,
    "shots": [
      {
        "at": 455.42,
        "kind": "image",
        "file": "ai-ppt/image-03.jpg",
        "label": "主视觉看整体"
      },
      {
        "at": 457.04,
        "kind": "image",
        "file": "ai-ppt/image-05.jpg",
        "label": "细节看特写"
      },
      {
        "at": 461.62,
        "kind": "image",
        "file": "ai-ppt/image-07.jpg",
        "label": "麦克风孔"
      },
      {
        "at": 463.9,
        "kind": "image",
        "file": "ai-ppt/image-06.jpg",
        "label": "硅胶耳塞"
      },
      {
        "at": 467.62,
        "kind": "image",
        "file": "ai-ppt/image-05.jpg",
        "label": "细节必须和原图一致"
      }
    ],
    "audio": [
      {
        "sourceStart": 13663,
        "sourceEnd": 14177
      }
    ],
    "durationInFrames": 514,
    "sourceStartFrame": 13663,
    "sourceEndFrame": 14177
  },
  {
    "id": "s30",
    "title": "单独抠出耳机",
    "chapter": "03 调版式",
    "sourceStart": 474.46,
    "sourceEnd": 498.4,
    "shots": [
      {
        "at": 474.46,
        "kind": "image",
        "file": "ai-ppt/image-06.jpg",
        "label": "带黑色背景的特写"
      },
      {
        "at": 479.4,
        "kind": "image",
        "file": "ai-ppt/image-07.jpg",
        "label": "适合整页大图"
      },
      {
        "at": 481.94,
        "kind": "image",
        "file": "ai-ppt/image-18.png",
        "label": "单独放一副耳机"
      },
      {
        "at": 492,
        "kind": "screen",
        "file": "10",
        "sourceStart": 38,
        "sourceEnd": 49,
        "zoom": 1.4,
        "cx": 0.5,
        "cy": 0.77,
        "label": "去掉背景",
        "mark": null
      },
      {
        "at": 496.9,
        "kind": "image",
        "file": "ai-ppt/image-18.png",
        "label": "透明背景 · 边缘干净"
      }
    ],
    "audio": [
      {
        "sourceStart": 14234,
        "sourceEnd": 14557
      },
      {
        "sourceStart": 14760,
        "sourceEnd": 14952
      }
    ],
    "durationInFrames": 515,
    "sourceStartFrame": 14234,
    "sourceEndFrame": 14952
  },
  {
    "id": "s31",
    "title": "补齐使用场景",
    "chapter": "03 调版式",
    "sourceStart": 498.4,
    "sourceEnd": 509.14,
    "shots": [
      {
        "at": 498.4,
        "kind": "image",
        "file": "ai-ppt/image-10.jpg",
        "label": "地铁通勤"
      },
      {
        "at": 503.96,
        "kind": "image",
        "file": "ai-ppt/image-09.jpg",
        "label": "办公室开会"
      },
      {
        "at": 506.98,
        "kind": "image",
        "file": "ai-ppt/image-10.jpg",
        "label": "让观众看懂使用场景"
      }
    ],
    "audio": [
      {
        "sourceStart": 14952,
        "sourceEnd": 15274
      }
    ],
    "durationInFrames": 322,
    "sourceStartFrame": 14952,
    "sourceEndFrame": 15274
  },
  {
    "id": "s32",
    "title": "开始重新排版",
    "chapter": "03 调版式",
    "sourceStart": 509.88,
    "sourceEnd": 519.02,
    "shots": [
      {
        "at": 509.88,
        "kind": "screen",
        "file": "12",
        "sourceStart": 23,
        "sourceEnd": 35,
        "zoom": 1.7,
        "cx": 0.44,
        "cy": 0.82,
        "label": "重新排版",
        "mark": null
      },
      {
        "at": 514.7,
        "kind": "screen",
        "file": "12",
        "sourceStart": 42,
        "sourceEnd": null,
        "zoom": 1.65,
        "cx": 0.48,
        "cy": 0.81,
        "label": "一页一件事 · 图大 · 字少",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 15296,
        "sourceEnd": 15571
      }
    ],
    "durationInFrames": 275,
    "sourceStartFrame": 15296,
    "sourceEndFrame": 15571
  },
  {
    "id": "s33",
    "title": "检查新版",
    "chapter": "03 调版式",
    "sourceStart": 526.26,
    "sourceEnd": 532.16,
    "shots": [
      {
        "at": 526.26,
        "kind": "screen",
        "file": "12",
        "sourceStart": 98,
        "sourceEnd": 111,
        "zoom": 1.15,
        "cx": 0.57,
        "cy": 0.57,
        "label": "逐页检查",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 15788,
        "sourceEnd": 15965
      }
    ],
    "durationInFrames": 177,
    "sourceStartFrame": 15788,
    "sourceEndFrame": 15965
  },
  {
    "id": "s34",
    "title": "圈出问题再修改",
    "chapter": "03 调版式",
    "sourceStart": 532.16,
    "sourceEnd": 546.3,
    "shots": [
      {
        "at": 532.16,
        "kind": "screen",
        "file": "12",
        "sourceStart": 113.5,
        "sourceEnd": null,
        "zoom": 1.15,
        "cx": 0.56,
        "cy": 0.58,
        "label": "地铁图被压扁",
        "mark": [
          0.27,
          0.38,
          0.33,
          0.43
        ]
      },
      {
        "at": 535.5,
        "kind": "screen",
        "file": "12",
        "sourceStart": 113.5,
        "sourceEnd": null,
        "zoom": 1.15,
        "cx": 0.56,
        "cy": 0.58,
        "label": "办公室场景缺失",
        "mark": [
          0.64,
          0.38,
          0.29,
          0.43
        ]
      },
      {
        "at": 537.36,
        "kind": "screen",
        "file": "12",
        "sourceStart": 102.5,
        "sourceEnd": null,
        "zoom": 1.15,
        "cx": 0.56,
        "cy": 0.58,
        "label": "第 4 页：手机原图",
        "mark": [
          0.59,
          0.4,
          0.29,
          0.4
        ]
      },
      {
        "at": 538.05,
        "kind": "screen",
        "file": "12",
        "sourceStart": 93.5,
        "sourceEnd": null,
        "zoom": 1.15,
        "cx": 0.56,
        "cy": 0.58,
        "label": "第 8 页：手机原图",
        "mark": [
          0.33,
          0.31,
          0.43,
          0.34
        ]
      },
      {
        "at": 538.72,
        "kind": "screen",
        "file": "12",
        "sourceStart": 90.5,
        "sourceEnd": null,
        "zoom": 1.15,
        "cx": 0.56,
        "cy": 0.58,
        "label": "第 9 页：手机原图",
        "mark": [
          0.6,
          0.38,
          0.28,
          0.42
        ]
      },
      {
        "at": 539.36,
        "kind": "screen",
        "file": "12",
        "sourceStart": 130,
        "sourceEnd": 136,
        "zoom": 1.7,
        "cx": 0.45,
        "cy": 0.82,
        "label": "哪一页 · 哪里不对 · 改成什么",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 15965,
        "sourceEnd": 16389
      }
    ],
    "durationInFrames": 424,
    "sourceStartFrame": 15965,
    "sourceEndFrame": 16389
  },
  {
    "id": "s35",
    "title": "核对修改结果",
    "chapter": "03 调版式",
    "sourceStart": 547.16,
    "sourceEnd": 550.88,
    "shots": [
      {
        "at": 547.16,
        "kind": "screen",
        "file": "12",
        "sourceStart": 154.25,
        "sourceEnd": null,
        "zoom": 1.1,
        "cx": 0.56,
        "cy": 0.57,
        "label": "场景图已修正",
        "mark": null
      },
      {
        "at": 548.86,
        "kind": "screen",
        "file": "12",
        "sourceStart": 160.75,
        "sourceEnd": null,
        "zoom": 1.1,
        "cx": 0.56,
        "cy": 0.57,
        "label": "卡片文字精简",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 16415,
        "sourceEnd": 16526
      }
    ],
    "durationInFrames": 111,
    "sourceStartFrame": 16415,
    "sourceEndFrame": 16526
  },
  {
    "id": "s36",
    "title": "参数表放到最后",
    "chapter": "03 调版式",
    "sourceStart": 551.28,
    "sourceEnd": 562.46,
    "shots": [
      {
        "at": 551.28,
        "kind": "screen",
        "file": "12",
        "sourceStart": 178,
        "sourceEnd": 188,
        "zoom": 1.7,
        "cx": 0.45,
        "cy": 0.83,
        "label": "把参数表移到最后",
        "mark": null
      },
      {
        "at": 557,
        "kind": "screen",
        "file": "12",
        "sourceStart": 199,
        "sourceEnd": 214,
        "zoom": 1.1,
        "cx": 0.55,
        "cy": 0.55,
        "label": "正文保留重点 · 参数作附录",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 16538,
        "sourceEnd": 16706
      },
      {
        "sourceStart": 16762,
        "sourceEnd": 16874
      }
    ],
    "durationInFrames": 280,
    "sourceStartFrame": 16538,
    "sourceEndFrame": 16874
  },
  {
    "id": "s37",
    "title": "图片和版式准备好了",
    "chapter": "03 调版式",
    "sourceStart": 562.46,
    "sourceEnd": 565.4,
    "shots": [
      {
        "at": 562.46,
        "kind": "screen",
        "file": "12",
        "sourceStart": 167.5,
        "sourceEnd": null,
        "zoom": 1.05,
        "cx": 0.55,
        "cy": 0.55,
        "label": "下一步：加动画",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 16874,
        "sourceEnd": 16962
      }
    ],
    "durationInFrames": 88,
    "sourceStartFrame": 16874,
    "sourceEndFrame": 16962
  },
  {
    "id": "s38",
    "title": "第四步：加动画",
    "chapter": "04 加动画",
    "sourceStart": 565.4,
    "sourceEnd": 575.62,
    "shots": [
      {
        "at": 565.4,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 16962,
        "sourceEnd": 17269
      }
    ],
    "durationInFrames": 307,
    "sourceStartFrame": 16962,
    "sourceEndFrame": 17269
  },
  {
    "id": "s39",
    "title": "页面之间如何切换",
    "chapter": "04 加动画",
    "sourceStart": 576.02,
    "sourceEnd": 594.9,
    "shots": [
      {
        "at": 576.02,
        "kind": "screen",
        "file": "13",
        "sourceStart": 48,
        "sourceEnd": 58,
        "zoom": 1.7,
        "cx": 0.45,
        "cy": 0.82,
        "label": "页面切换",
        "mark": null
      },
      {
        "at": 581.18,
        "kind": "screen",
        "file": "13",
        "sourceStart": 55,
        "sourceEnd": null,
        "zoom": 1.6,
        "cx": 0.45,
        "cy": 0.8,
        "label": "页面内的内容登场",
        "mark": null
      },
      {
        "at": 588.84,
        "kind": "screen",
        "file": "15",
        "sourceStart": 59,
        "sourceEnd": 66.7,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "三色耳机展开",
        "mark": null
      },
      {
        "at": 592.66,
        "kind": "screen",
        "file": "13",
        "sourceStart": 55,
        "sourceEnd": null,
        "zoom": 1.7,
        "cx": 0.45,
        "cy": 0.83,
        "label": "其他页淡入淡出",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 17281,
        "sourceEnd": 17479
      },
      {
        "sourceStart": 17537,
        "sourceEnd": 17847
      }
    ],
    "durationInFrames": 508,
    "sourceStartFrame": 17281,
    "sourceEndFrame": 17847
  },
  {
    "id": "s40",
    "title": "封面与价格页动画",
    "chapter": "04 加动画",
    "sourceStart": 595.82,
    "sourceEnd": 613.96,
    "shots": [
      {
        "at": 595.82,
        "kind": "screen",
        "file": "14",
        "sourceStart": 22,
        "sourceEnd": 26,
        "zoom": 1.75,
        "cx": 0.45,
        "cy": 0.81,
        "label": "先做重点页",
        "mark": null
      },
      {
        "at": 602.76,
        "kind": "screen",
        "file": "15",
        "sourceStart": 22,
        "sourceEnd": 31.7,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "封面：由近及远",
        "mark": null
      },
      {
        "at": 607.56,
        "kind": "screen",
        "file": "15",
        "sourceStart": 67,
        "sourceEnd": 72.2,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "原价 → 划掉 → 新价格",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 17875,
        "sourceEnd": 18419
      }
    ],
    "durationInFrames": 544,
    "sourceStartFrame": 17875,
    "sourceEndFrame": 18419
  },
  {
    "id": "s41",
    "title": "其他页面轻一点",
    "chapter": "04 加动画",
    "sourceStart": 614.52,
    "sourceEnd": 621.44,
    "shots": [
      {
        "at": 614.52,
        "kind": "screen",
        "file": "14",
        "sourceStart": 42,
        "sourceEnd": 50,
        "zoom": 1.7,
        "cx": 0.45,
        "cy": 0.83,
        "label": "其他页的动画不能抢重点",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 18436,
        "sourceEnd": 18643
      }
    ],
    "durationInFrames": 207,
    "sourceStartFrame": 18436,
    "sourceEndFrame": 18643
  },
  {
    "id": "s42",
    "title": "进入放映模式",
    "chapter": "04 加动画",
    "sourceStart": 623.29,
    "sourceEnd": 629.85,
    "shots": [
      {
        "at": 623.29,
        "kind": "screen",
        "file": "15",
        "sourceStart": 16,
        "sourceEnd": 22,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "编辑界面 → 放映",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 18699,
        "sourceEnd": 18896
      }
    ],
    "durationInFrames": 197,
    "sourceStartFrame": 18699,
    "sourceEndFrame": 18896
  },
  {
    "id": "s43",
    "title": "检查完整效果",
    "chapter": "04 加动画",
    "sourceStart": 629.85,
    "sourceEnd": 637.75,
    "shots": [
      {
        "at": 629.85,
        "kind": "screen",
        "file": "15",
        "sourceStart": 24,
        "sourceEnd": 32,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "封面",
        "mark": null
      },
      {
        "at": 632,
        "kind": "screen",
        "file": "15",
        "sourceStart": 59,
        "sourceEnd": 66.7,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "三色耳机",
        "mark": null
      },
      {
        "at": 634,
        "kind": "screen",
        "file": "15",
        "sourceStart": 67,
        "sourceEnd": 72.5,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "价格",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 18896,
        "sourceEnd": 19132
      }
    ],
    "durationInFrames": 236,
    "sourceStartFrame": 18896,
    "sourceEndFrame": 19132
  },
  {
    "id": "s44",
    "title": "和一句话版本比较",
    "chapter": "04 加动画",
    "sourceStart": 638.81,
    "sourceEnd": 654.93,
    "shots": [
      {
        "at": 638.81,
        "kind": "compare-earbuds",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 19164,
        "sourceEnd": 19648
      }
    ],
    "durationInFrames": 484,
    "sourceStartFrame": 19164,
    "sourceEndFrame": 19648
  },
  {
    "id": "s45",
    "title": "下次还要重说吗",
    "chapter": "05 做 Skill",
    "sourceStart": 660.23,
    "sourceEnd": 666.17,
    "shots": [
      {
        "at": 660.23,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 19807,
        "sourceEnd": 19985
      }
    ],
    "durationInFrames": 178,
    "sourceStartFrame": 19807,
    "sourceEndFrame": 19985
  },
  {
    "id": "s46",
    "title": "第五步：做 Skill",
    "chapter": "05 做 Skill",
    "sourceStart": 666.97,
    "sourceEnd": 675.35,
    "shots": [
      {
        "at": 666.97,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 20009,
        "sourceEnd": 20260
      }
    ],
    "durationInFrames": 251,
    "sourceStartFrame": 20009,
    "sourceEndFrame": 20260
  },
  {
    "id": "s47",
    "title": "整理成自己的 Skill",
    "chapter": "05 做 Skill",
    "sourceStart": 675.35,
    "sourceEnd": 682.11,
    "shots": [
      {
        "at": 675.35,
        "kind": "screen",
        "file": "16",
        "sourceStart": 40,
        "sourceEnd": 46,
        "zoom": 1.75,
        "cx": 0.48,
        "cy": 0.81,
        "label": "把一路提的要求存下来",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 20260,
        "sourceEnd": 20463
      }
    ],
    "durationInFrames": 203,
    "sourceStartFrame": 20260,
    "sourceEndFrame": 20463
  },
  {
    "id": "s48",
    "title": "保存的是做法",
    "chapter": "05 做 Skill",
    "sourceStart": 682.77,
    "sourceEnd": 692.21,
    "shots": [
      {
        "at": 682.77,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 20483,
        "sourceEnd": 20766
      }
    ],
    "durationInFrames": 283,
    "sourceStartFrame": 20483,
    "sourceEndFrame": 20766
  },
  {
    "id": "s49",
    "title": "换个产品再试一次",
    "chapter": "05 做 Skill",
    "sourceStart": 692.85,
    "sourceEnd": 705.81,
    "shots": [
      {
        "at": 692.85,
        "kind": "screen",
        "file": "16",
        "sourceStart": 92,
        "sourceEnd": 100,
        "zoom": 1.2,
        "cx": 0.5,
        "cy": 0.6,
        "label": "新开对话",
        "mark": null
      },
      {
        "at": 696,
        "kind": "screen",
        "file": "16",
        "sourceStart": 107,
        "sourceEnd": 120,
        "zoom": 1.3,
        "cx": 0.6,
        "cy": 0.48,
        "label": "上传充电宝资料",
        "mark": null
      },
      {
        "at": 698.57,
        "kind": "screen",
        "file": "16",
        "sourceStart": 121,
        "sourceEnd": 126,
        "zoom": 1.45,
        "cx": 0.48,
        "cy": 0.79,
        "label": "调用自己的 Skill",
        "mark": null
      },
      {
        "at": 702,
        "kind": "screen",
        "file": "16",
        "sourceStart": 129,
        "sourceEnd": 136,
        "zoom": 1.8,
        "cx": 0.5,
        "cy": 0.83,
        "label": "帮我做个产品宣传 PPT",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 20786,
        "sourceEnd": 21174
      }
    ],
    "durationInFrames": 388,
    "sourceStartFrame": 20786,
    "sourceEndFrame": 21174
  },
  {
    "id": "s50",
    "title": "打开充电宝 PPT",
    "chapter": "05 做 Skill",
    "sourceStart": 706.45,
    "sourceEnd": 708.73,
    "shots": [
      {
        "at": 706.45,
        "kind": "screen",
        "file": "17",
        "sourceStart": 7,
        "sourceEnd": 16,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "打开新产品的 PPT",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 21194,
        "sourceEnd": 21262
      }
    ],
    "durationInFrames": 68,
    "sourceStartFrame": 21194,
    "sourceEndFrame": 21262
  },
  {
    "id": "s51",
    "title": "要求被复用了",
    "chapter": "05 做 Skill",
    "sourceStart": 709.33,
    "sourceEnd": 713.71,
    "shots": [
      {
        "at": 709.33,
        "kind": "screen",
        "file": "17",
        "sourceStart": 17,
        "sourceEnd": 22,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "成品放映",
        "mark": null
      },
      {
        "at": 711.1,
        "kind": "screen",
        "file": "17",
        "sourceStart": 32,
        "sourceEnd": 37,
        "zoom": 1,
        "cx": 0.5,
        "cy": 0.5,
        "label": "版式和动画随新产品调整",
        "mark": null
      }
    ],
    "audio": [
      {
        "sourceStart": 21280,
        "sourceEnd": 21411
      }
    ],
    "durationInFrames": 131,
    "sourceStartFrame": 21280,
    "sourceEndFrame": 21411
  },
  {
    "id": "s52",
    "title": "有没有 Skill 的差别",
    "chapter": "05 做 Skill",
    "sourceStart": 714.23,
    "sourceEnd": 736.73,
    "shots": [
      {
        "at": 714.23,
        "kind": "compare-power",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 21427,
        "sourceEnd": 21907
      },
      {
        "sourceStart": 22033,
        "sourceEnd": 22102
      }
    ],
    "durationInFrames": 549,
    "sourceStartFrame": 21427,
    "sourceEndFrame": 22102
  },
  {
    "id": "s53",
    "title": "五步回顾",
    "chapter": "课程总结",
    "sourceStart": 737.31,
    "sourceEnd": 757.23,
    "shots": [
      {
        "at": 737.31,
        "kind": "steps",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 22119,
        "sourceEnd": 22717
      }
    ],
    "durationInFrames": 598,
    "sourceStartFrame": 22119,
    "sourceEndFrame": 22717
  },
  {
    "id": "s54",
    "title": "一步步打磨",
    "chapter": "课程总结",
    "sourceStart": 760.01,
    "sourceEnd": 765.83,
    "shots": [
      {
        "at": 760.01,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 22800,
        "sourceEnd": 22975
      }
    ],
    "durationInFrames": 175,
    "sourceStartFrame": 22800,
    "sourceEndFrame": 22975
  },
  {
    "id": "s55",
    "title": "自己动手试一试",
    "chapter": "课程总结",
    "sourceStart": 766.27,
    "sourceEnd": 790.28,
    "shots": [
      {
        "at": 766.27,
        "kind": "presenter",
        "label": ""
      }
    ],
    "audio": [
      {
        "sourceStart": 22988,
        "sourceEnd": 23354
      },
      {
        "sourceStart": 23397,
        "sourceEnd": 23708
      }
    ],
    "durationInFrames": 677,
    "sourceStartFrame": 22988,
    "sourceEndFrame": 23708
  }
];
export const TOTAL_FRAMES=scenes.reduce((n,s)=>n+s.durationInFrames,0);
export const sourceToFrame=(scene:Scene,seconds:number)=>{let at=0;for(const c of scene.audio){if(seconds*FPS<c.sourceStart)return at;if(seconds*FPS<c.sourceEnd)return at+Math.round(seconds*FPS)-c.sourceStart;at+=c.sourceEnd-c.sourceStart;}return at;};
export const frameToSource=(scene:Scene,frame:number)=>{let at=0;for(const c of scene.audio){const d=c.sourceEnd-c.sourceStart;if(frame<at+d)return (c.sourceStart+frame-at)/FPS;at+=d;}return scene.sourceEnd;};
