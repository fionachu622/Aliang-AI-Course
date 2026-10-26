import {AbsoluteFill, Img, staticFile} from 'remotion';

const samples = [
  {
    id: 'A',
    name: '阿里巴巴普惠体 2.0',
    mood: '亲和科技',
    fontFamily:
      '"Alibaba PuHuiTi 2.0", "Alibaba PuHuiTi", "PingFang SC", sans-serif',
    fontWeight: 700,
    accent: '#7CC8EA',
  },
  {
    id: 'B',
    name: '冬青黑体',
    mood: '柔和人文',
    fontFamily:
      '"Hiragino Sans GB", "冬青黑体简体中文", "PingFang SC", sans-serif',
    fontWeight: 600,
    accent: '#A4D486',
  },
  {
    id: 'C',
    name: '思源黑体',
    mood: '理性清晰',
    fontFamily:
      '"Source Han Sans SC", "思源黑体", "PingFang SC", sans-serif',
    fontWeight: 700,
    accent: '#F0D26A',
  },
  {
    id: 'D',
    name: '宋体编辑风',
    mood: '知识感',
    fontFamily: '"Songti SC", "STSong", "SimSun", serif',
    fontWeight: 700,
    accent: '#EFA884',
  },
  {
    id: 'E',
    name: '优设标题黑',
    mood: '鲜明有力',
    fontFamily:
      '"YouSheBiaoTiHei", "优设标题黑", "Alibaba PuHuiTi", sans-serif',
    fontWeight: 400,
    accent: '#F18D9E',
  },
] as const;

const utilityFont =
  '"Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';

export const Lesson1FontPreview = () => {
  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        color: '#F5F1E8',
        backgroundColor: '#24272A',
        fontFamily: utilityFont,
      }}
    >
      <Img
        src={staticFile(
          'shared-visual/backgrounds/geometric/geometric-grid-light.png',
        )}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.62,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(29,32,35,.22) 0%, rgba(29,32,35,.72) 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          height: '100%',
          padding: '54px 108px 58px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <header
          style={{
            height: 112,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(245,241,232,.22)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 38,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: -1,
              }}
            >
              第 1 课 · 字体方向预览
            </div>
            <div
              style={{
                marginTop: 16,
                color: 'rgba(245,241,232,.56)',
                fontSize: 22,
                letterSpacing: 1,
              }}
            >
              同一句内容 · 同一尺寸 · 只比较字体气质
            </div>
          </div>
          <div
            style={{
              color: 'rgba(245,241,232,.56)',
              fontSize: 22,
              letterSpacing: 3,
            }}
          >
            FONT STUDY / 05
          </div>
        </header>

        <div style={{flex: 1, display: 'grid', gridTemplateRows: 'repeat(5, 1fr)'}}>
          {samples.map((sample, index) => (
            <section
              key={sample.id}
              style={{
                minHeight: 0,
                display: 'grid',
                gridTemplateColumns: '230px 1.2fr .82fr',
                alignItems: 'center',
                gap: 42,
                borderBottom:
                  index === samples.length - 1
                    ? undefined
                    : '1px solid rgba(245,241,232,.14)',
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    display: 'grid',
                    placeItems: 'center',
                    border: `2px solid ${sample.accent}`,
                    color: sample.accent,
                    fontSize: 24,
                    fontWeight: 800,
                  }}
                >
                  {sample.id}
                </div>
                <div>
                  <div style={{fontSize: 24, fontWeight: 700}}>{sample.name}</div>
                  <div
                    style={{
                      marginTop: 9,
                      color: sample.accent,
                      fontSize: 18,
                      letterSpacing: 2,
                    }}
                  >
                    {sample.mood}
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontFamily: sample.fontFamily,
                  fontSize: 62,
                  lineHeight: 1,
                  fontWeight: sample.fontWeight,
                  letterSpacing: -2.2,
                  whiteSpace: 'nowrap',
                }}
              >
                中间发生了什么？
              </div>

              <div style={{fontFamily: sample.fontFamily}}>
                <div
                  style={{
                    color: sample.accent,
                    fontSize: 32,
                    lineHeight: 1.1,
                    fontWeight: sample.fontWeight,
                  }}
                >
                  AI 产品 · 大模型
                </div>
                <div
                  style={{
                    marginTop: 13,
                    color: 'rgba(245,241,232,.55)',
                    fontSize: 20,
                    letterSpacing: 1.2,
                  }}
                >
                  LLM · Tokenizer · Token ID
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

