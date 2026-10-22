(function(){
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}

  // scroll progress, sticky header shrink, back-to-top
  var bar=document.createElement('div');bar.className='prog';document.body.appendChild(bar);
  var up=document.createElement('button');up.type='button';up.className='totop';up.setAttribute('aria-label','Back to top');
  up.innerHTML='<svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg>';document.body.appendChild(up);
  up.addEventListener('click',function(){window.scrollTo({top:0,behavior:rm?'auto':'smooth'})});
  var hdr=$('.hdr'),tick=false;
  function onScroll(){
    var y=window.scrollY,h=document.documentElement.scrollHeight-innerHeight;
    bar.style.width=(h>0?y/h*100:0)+'%';
    if(hdr)hdr.classList.toggle('stuck',y>40);
    up.classList.toggle('on',y>700);
    var hs=$('.hslides .bg.on,.hs.on .bg');
    if(hs&&!rm&&y<900)hs.style.marginTop=(y*.12)+'px';
    tick=false;
  }
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

  // reveal on scroll (auto-applied to common blocks, staggered inside grids)
  var sel='.sh,.card,.offer,.why,.step,.tgrid a,.tiles a,.gal a,.pgal figure,details,.side,.form,.cta,.finder,.split>*,.promo>div,.stats .s,.layout>div>h2,.layout .art,.news,.chips a,.trust>div';
  var els=$$(sel).filter(function(e){return !e.closest('.hero,.phead,.ftr,.chat,.fab')});
  els.forEach(function(e){
    e.classList.add('rv');
    var p=e.parentElement,i=Array.prototype.indexOf.call(p.children,e);
    e.style.setProperty('--d',Math.min(i,6)*0.08+'s');
    if(e.matches('.split>*')) e.classList.add(i%2?'r':'l');
    if(e.matches('.stats .s,.promo>div'))e.classList.add('z');
  });
  if('IntersectionObserver' in window&&!rm){
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(e){io.observe(e)});
  }else els.forEach(function(e){e.classList.add('in')});

  // counters
  var cs=$$('[data-count]');
  function run(el){
    var to=+el.getAttribute('data-count'),t0=null,d=1600;
    if(rm||!to){el.textContent=to;return}
    (function f(t){if(!t0)t0=t;var k=Math.min((t-t0)/d,1),e=1-Math.pow(1-k,3);el.textContent=Math.round(to*e);if(k<1)requestAnimationFrame(f)})(performance.now());
  }
  if('IntersectionObserver' in window){
    var co=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){run(x.target);co.unobserve(x.target)}})},{threshold:.5});
    cs.forEach(function(c){c.textContent='0';co.observe(c)});
  }

  // hero carousel
  var hero=$('.hero');
  if(hero){
    var sl=$$('.hs',hero),dots=$$('.hdots button',hero),cur=0,timer;
    function go(n){
      cur=(n+sl.length)%sl.length;
      sl.forEach(function(s,i){s.classList.toggle('on',i===cur)});
      dots.forEach(function(d,i){d.classList.remove('on');if(i===cur){void d.offsetWidth;d.classList.add('on')}});
      sl.forEach(function(s,i){var b=$('.bg',s);if(b)b.style.marginTop=''});
      restart();
    }
    function restart(){clearInterval(timer);if(!rm)timer=setInterval(function(){go(cur+1)},7000)}
    $('.harr.n',hero).addEventListener('click',function(){go(cur+1)});
    $('.harr.p',hero).addEventListener('click',function(){go(cur-1)});
    dots.forEach(function(d,i){d.addEventListener('click',function(){go(i)})});
    hero.addEventListener('mouseenter',function(){hero.classList.add('paused');clearInterval(timer)});
    hero.addEventListener('mouseleave',function(){hero.classList.remove('paused');restart()});
    var sx=0;hero.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
    hero.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)go(cur+(dx<0?1:-1))});
    document.addEventListener('visibilitychange',function(){document.hidden?clearInterval(timer):restart()});
    restart();
    // pointer parallax on product image
    if(!rm)hero.addEventListener('mousemove',function(e){
      var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      $$('.hs.on .pic',hero).forEach(function(p){p.style.transform='translate('+x*-22+'px,'+y*-14+'px)'});
    });
  }

  // tools tabs
  var tabs=$('.tools .tabs');
  if(tabs)tabs.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    $$('button',tabs).forEach(function(x){x.classList.toggle('on',x===b)});
    var g=b.getAttribute('data-g');
    $$('.tgrid a').forEach(function(a,i){
      var show=g==='all'||a.getAttribute('data-g')===g;a.hidden=!show;
      if(show){a.classList.remove('in');a.classList.add('rv');a.style.setProperty('--d',(i%6)*.05+'s');requestAnimationFrame(function(){requestAnimationFrame(function(){a.classList.add('in')})})}
    });
  });

  // card tilt on desktop pointers
  if(!rm&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    $$('.tgrid a,.quick a').forEach(function(c){
      c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='translateY(-8px) perspective(600px) rotateX('+(-y*8)+'deg) rotateY('+(x*8)+'deg)'});
      c.addEventListener('mouseleave',function(){c.style.transform=''});
    });
  }
})();
