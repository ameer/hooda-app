<template>
  <div class="gauge" :class="showDigits ? 'load': ''" data-digit="30" style="background:transparent">
    <div class="gauge-outer">
      <i v-for="(item, index) in points" :key="'outer-bar-'+index" class="bar" :style="`${outerBarStyle(index)}`" />
    </div>
    <div class="gauge-inner">
      <i v-for="(item, index) in points" :key="'inner-bar-'+index" :ref="isPeak(index) ? 'peak' : 'bar-'+index" :class="`bar${isPeak(index) ? ' peak' : ''}`" :style="`transform: rotate(${degree(index)}deg)`" />
    </div>
    <div v-if="showDigits" class="gauge-digits">
      <span class="digit current-digit count">{{ digit }}</span>
      <span v-for="(item, index) in peaks" :key="'digit-'+index" class="digit" :style="`top:${getPeakOffsetTop(index)}px;left:${getPeakOffsetLeft(index)}px`">{{ item }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    digit: {
      type: Number,
      default: 33
    }
  },
  data () {
    return {
      points: 43,
      radius: 257,
      max: 60,
      peaks: [10, 30, 50],
      showDigits: false
    }
  },
  computed: {
    step () {
      return (this.max + 1) / this.points
    },
    realPeaks () {
      return this.peaks.map(peak => Math.floor(peak * (1 / this.step)))
    },
    hueStep () {
      return 120 / this.points
    }
  },
  mounted () {
    const self = this
    setTimeout(() => { self.showDigits = true }, 150)
  },
  methods: {
    getPeakOffsetLeft (i) {
      const peaks = document.getElementsByClassName('peak')
      const lastPeak = peaks[i]
      const gaugeDigits = document.getElementsByClassName('gauge-inner')
      const parent = gaugeDigits[0]
      const parentLeft = parent.getBoundingClientRect().left
      const left = lastPeak.getBoundingClientRect().left

      if (i === 0) {
        return left - parentLeft + 18
      } else if (i === 2) {
        return left - parentLeft - 18
      } else {
        return left - parentLeft - 7
      }
    },
    getPeakOffsetTop (i) {
      const peaks = document.getElementsByClassName('peak')
      const lastPeak = peaks[i]
      const gaugeDigits = document.getElementsByClassName('gauge-inner')
      const parent = gaugeDigits[0]
      const parentTop = parent.getBoundingClientRect().top
      const top = lastPeak.getBoundingClientRect().top
      if (i === 1) {
        return top - parentTop + 18
      } else {
        return top - parentTop
      }
    },
    isPeak (i) {
      return this.realPeaks.includes(i)
    },
    degree (i) {
      return i * (this.radius / (this.points - 1)) - this.radius / 2
    },
    outerBarStyle (i) {
      const degree = i * (this.radius / (this.points - 1)) - this.radius / 2
      const intStep = Math.ceil(this.step * i)
      const intNextStep = Math.ceil(this.step * (i + 1))
      let styles = `transition-delay: ${(i / this.digit) * (i / this.digit) + 1}s;`
      if (intStep <= this.digit) {
        styles += `background-color: hsl(${240 + i * this.hueStep}, 92%, 64%);`
      }
      if (intStep > this.digit || (intStep <= this.digit && intNextStep <= this.digit)) {
        styles += `
            -webkit-transform: rotate(${degree}deg);
            -moz-transform: rotate(${degree}deg);
            -ms-transform: rotate(${degree}deg);
            -o-transform: rotate(${degree}deg);
            transform: rotate(${degree}deg);`
      } else if (intNextStep > this.digit) {
        styles += `
                -webkit-transform: rotate(${degree}deg) translateY(-.3em);
                -moz-transform: rotate(${degree}deg) translateY(-.3em);
                -ms-transform: rotate(${degree}deg) translateY(-.3em);
                -o-transform: rotate(${degree}deg) translateY(-.3em);
                transform: rotate(${degree}deg) translateY(-.3em);
                height: 1em;`
      }
      return styles
    },
    intNextStep (i) {
      Math.ceil(this.step * (i + 1))
    }
  }
}
</script>
<style>
  .gauge {
  position: relative;
  width: 100%;
  margin: 0.5em auto;
  font-size: 2rem;
  direction: ltr;
}

.gauge-inner {
  position: relative;
  top: 1.8rem;
  opacity: 0;
  transition: opacity 0.5s;
}
.gauge.load .gauge-inner {
  opacity: 1;
}
.gauge-inner .bar {
  left: 50%;
  position: absolute;
  transform-origin: 0 2.5em;
  width: 0.03em;
  height: 0.2em;
  background: rgba(0, 0, 0, 0.2);
}
.gauge-inner .bar.peak {
  height: 0.35em;
}

.gauge-outer {
  position: relative;
  height: 100%;
  margin-top: 0.3em;
}
.gauge-outer .bar {
  position: absolute;
  width: 0.05em;
  height: 0.7em;
  left: 50%;
  transform-origin: 0 3.43em;
  background-color: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.5s;
}
.gauge.load .gauge-outer .bar {
  opacity: 1;
}

.gauge-digits {
  position: relative;
  top: 1.8rem;
  color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.5s 0.5s;
}
.gauge.load .gauge-digits {
  opacity: 1;
}
.gauge-digits.scale {
  transform: translateX(-50%) scale(0.8);
}
.gauge-digits .digit {
  position: absolute;
  font-size: 0.4em;
  line-height: 0.2;
}
.gauge-digits .current-digit {
  left: 50%;
  top: 4.75rem;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  color: rgba(59, 59, 59, 0.9);
}
.gauge-digits .current-digit:after {
  content: "°";
}

</style>
