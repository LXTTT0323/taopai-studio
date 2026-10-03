document.documentElement.classList.add('js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const mentorMarquee=document.querySelector('.mentor-marquee'),mentorTrack=document.querySelector('.mentor-track');
if(mentorMarquee&&mentorTrack){
  const mentorCopy=mentorTrack.querySelector('ul').cloneNode(true);
  mentorCopy.setAttribute('aria-hidden','true');mentorCopy.removeAttribute('aria-label');mentorTrack.append(mentorCopy);
  const syncMentorMotion=()=>{mentorMarquee.classList.toggle('is-animated',!reduced.matches);};
  syncMentorMotion();reduced.addEventListener('change',syncMentorMotion);
}
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const progressBar=document.createElement('div');progressBar.className='scroll-progress';progressBar.setAttribute('aria-hidden','true');document.body.append(progressBar);
addEventListener('scroll',()=>{progressBar.style.transform=`scaleX(${clamp(scrollY/(document.documentElement.scrollHeight-innerHeight))})`;},{passive:true});
const viewer=document.createElement('dialog');viewer.className='image-viewer';viewer.innerHTML='<button type="button" aria-label="关闭截图">×</button><h3 id="viewer-title">官方招聘原文 · 局部截图</h3><img alt=""><p>截图仅截取相关要求，未改写内容。完整招聘要求及开放状态以原页面为准。</p>';viewer.setAttribute('aria-labelledby','viewer-title');document.body.append(viewer);viewer.querySelector('button').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close();});
document.querySelectorAll('.source-shot img').forEach(img=>{const button=document.createElement('button');button.type='button';button.className='shot-button';button.style.cssText='display:block;border:0;background:none;padding:0;width:100%;cursor:zoom-in';button.setAttribute('aria-label','放大查看'+img.closest('article').querySelector('strong').textContent+'招聘截图');img.parentNode.insertBefore(button,img);button.append(img);button.addEventListener('click',()=>{viewer.querySelector('img').src=img.src;viewer.querySelector('img').alt=img.alt;viewer.showModal();});});
