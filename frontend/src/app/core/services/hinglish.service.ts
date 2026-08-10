import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * HinglishService
 * ─────────────────────────────────────────────────────────────────
 * Provides a global toggle between English and Hinglish (Hindi + English
 * mixed) mode.  The translate() method converts English text to Hinglish by:
 *  1. Replacing known English words/phrases with their Hinglish equivalents
 *  2. Adding Hindi sentence connectors & endings
 *  3. Injecting characteristic Hinglish patterns ("yeh", "hai", "karo" etc.)
 * ─────────────────────────────────────────────────────────────────
 */
@Injectable({ providedIn: 'root' })
export class HinglishService {

  private _isHinglish$ = new BehaviorSubject<boolean>(false);
  isHinglish$ = this._isHinglish$.asObservable();

  get isHinglish(): boolean { return this._isHinglish$.value; }

  constructor() {
    const saved = localStorage.getItem('sjm_lang');
    if (saved === 'hi') this._isHinglish$.next(true);
  }

  setHinglish(val: boolean) {
    this._isHinglish$.next(val);
    localStorage.setItem('sjm_lang', val ? 'hi' : 'en');
  }

  /** Core word/phrase dictionary: English → Hinglish */
  private dict: [RegExp, string][] = [
    // ── Technical Spring / Java Terms ──────────────────────────────
    [/\bSpring Boot\b/gi,            'Spring Boot'],
    [/\bDependency Injection\b/gi,   'Dependency Injection (DI yani ek object doosre ko dena)'],
    [/\bInversion of Control\b/gi,   'Inversion of Control (IoC — Spring khud control leta hai)'],
    [/\bBean\b/gi,                   'Bean (Spring ka managed object)'],
    [/\bComponent\b/gi,              'Component (ek class jisko Spring manage karta hai)'],
    [/\bAnnotation\b/gi,             'Annotation (@ wala label)'],
    [/\bAutowired\b/gi,              '@Autowired (Spring khud inject karta hai)'],
    [/\bController\b/gi,             'Controller (HTTP requests handle karta hai)'],
    [/\bService\b/gi,                'Service (business logic wali layer)'],
    [/\bRepository\b/gi,             'Repository (database se baat karta hai)'],
    [/\bEntity\b/gi,                 'Entity (database table ka object)'],
    [/\bJPA\b/gi,                    'JPA (Java Persistence API — DB ke liye)'],
    [/\bHibernate\b/gi,              'Hibernate (ORM tool, Java aur DB ko connect karta hai)'],
    [/\bREST API\b/gi,               'REST API (web services ka ek style)'],
    [/\bEndpoint\b/gi,               'Endpoint (URL jahan request jaati hai)'],
    [/\bRequest\b/gi,                'Request (client ki maang)'],
    [/\bResponse\b/gi,               'Response (server ka jawab)'],
    [/\bException\b/gi,              'Exception (error jo program me aata hai)'],
    [/\bInterface\b/gi,              'Interface (contract ya blueprint)'],
    [/\bAbstract\b/gi,               'Abstract (incomplete class)'],
    [/\bInheritance\b/gi,            'Inheritance (ek class doosri se inherit karna)'],
    [/\bPolymorphism\b/gi,           'Polymorphism (ek kaam kai tareekon se karna)'],
    [/\bEncapsulation\b/gi,          'Encapsulation (data chhupaana)'],
    [/\bThread\b/gi,                 'Thread (ek chhota execution path)'],
    [/\bConcurrency\b/gi,            'Concurrency (kai kaam ek saath)'],
    [/\bStream\b/gi,                 'Stream (data ka flow)'],
    [/\bLambda\b/gi,                 'Lambda (chhota anonymous function)'],
    [/\bGarbage Collection\b/gi,     'Garbage Collection (memory saaf karna)'],
    [/\bJVM\b/gi,                    'JVM (Java Virtual Machine)'],
    [/\bHeap\b/gi,                   'Heap (JVM ka memory area)'],
    [/\bStack\b/gi,                  'Stack (function calls ka area)'],
    [/\bMicroservices\b/gi,          'Microservices (chote chote services)'],
    [/\bDocker\b/gi,                 'Docker (container banana)'],
    [/\bKubernetes\b/gi,             'Kubernetes (K8s, container manage karna)'],
    [/\bKafka\b/gi,                  'Kafka (message broker)'],
    [/\bTransaction\b/gi,            'Transaction (ek logical kaam ka group)'],
    [/\bCache\b/gi,                  'Cache (fast memory me store karna)'],
    [/\bIndex\b/gi,                  'Index (DB me search fast karna)'],
    [/\bQuery\b/gi,                  'Query (DB se poochna)'],
    [/\bDatabase\b/gi,               'Database (data ka ghar)'],
    [/\bSQL\b/gi,                    'SQL (Structured Query Language)'],
    [/\bObject\b/gi,                 'Object (kisi class ka instance)'],
    [/\bClass\b/gi,                  'Class (object ka blueprint)'],
    [/\bMethod\b/gi,                 'Method (function ya kaam)'],
    [/\bField\b/gi,                  'Field (class ka variable)'],
    [/\bConstructor\b/gi,            'Constructor (object banate waqt chalta hai)'],
    [/\bSingleton\b/gi,              'Singleton (sirf ek hi instance)'],
    [/\bPrototype\b/gi,              'Prototype (har baar naya instance)'],
    [/\bScope\b/gi,                  'Scope (kitni jagah valid hai)'],
    [/\bConfiguration\b/gi,          'Configuration (settings)'],
    [/\bProperty\b/gi,               'Property (setting ya variable)'],
    [/\bSecurity\b/gi,               'Security (suraksha)'],
    [/\bAuthentication\b/gi,         'Authentication (pehchaan verify karna)'],
    [/\bAuthorization\b/gi,          'Authorization (permission check karna)'],
    [/\bFilter\b/gi,                 'Filter (request/response rokna ya modify karna)'],
    [/\bInterceptor\b/gi,            'Interceptor (request beech me pakadna)'],
    [/\bProxy\b/gi,                  'Proxy (beech me kaam karne wala)'],
    [/\bAOP\b/gi,                    'AOP (Aspect Oriented Programming — common kaam alag karna)'],
    [/\bTransaction Management\b/gi, 'Transaction Management (DB transactions handle karna)'],

    // ── Common English words → Hinglish ─────────────────────────────
    [/\bunderstand\b/gi,    'samjho'],
    [/\bremember\b/gi,      'yaad rakho'],
    [/\bimportant\b/gi,     'important (zaroori)'],
    [/\bexample\b/gi,       'example (udaharan)'],
    [/\bused\b/gi,          'use hota hai'],
    [/\bcreate\b/gi,        'create karo'],
    [/\bdefine\b/gi,        'define karo'],
    [/\bdeclare\b/gi,       'declare karo'],
    [/\binjected\b/gi,      'inject kiya jaata hai'],
    [/\bmanaged\b/gi,       'manage kiya jaata hai'],
    [/\bcalled\b/gi,        'call kiya jaata hai'],
    [/\breturns\b/gi,       'return karta hai'],
    [/\bthrows\b/gi,        'throw karta hai'],
    [/\bimplements\b/gi,    'implement karta hai'],
    [/\bextends\b/gi,       'extend karta hai'],
    [/\boverrides\b/gi,     'override karta hai'],
    [/\bfollowing\b/gi,     'neeche diye hue'],
    [/\bsimple\b/gi,        'simple (aasaan)'],
    [/\bbasically\b/gi,     'basically (matlab)'],
    [/\bactually\b/gi,      'actually (sach me)'],
    [/\bautomatically\b/gi, 'automatically (khud-ba-khud)'],
    [/\bprovides\b/gi,      'provide karta hai'],
    [/\ballows\b/gi,        'allow karta hai'],
    [/\benables\b/gi,       'enable karta hai'],
    [/\bensures\b/gi,       'ensure karta hai'],
    [/\brepresents\b/gi,    'represent karta hai'],
    [/\bstores\b/gi,        'store karta hai'],
    [/\bcontains\b/gi,      'contain karta hai'],
    [/\bhandles\b/gi,       'handle karta hai'],
    [/\bprocesses\b/gi,     'process karta hai'],
    [/\bexecutes\b/gi,      'execute karta hai'],
    [/\bperforms\b/gi,      'perform karta hai'],
    [/\breads\b/gi,         'read karta hai'],
    [/\bwrites\b/gi,        'write karta hai'],
    [/\bsends\b/gi,         'send karta hai'],
    [/\breceives\b/gi,      'receive karta hai'],
    [/\bconnects\b/gi,      'connect karta hai'],
    [/\bconverts\b/gi,      'convert karta hai'],
    [/\bvalidates\b/gi,     'validate karta hai'],
    [/\bgenerates\b/gi,     'generate karta hai'],
    [/\bdeletes\b/gi,       'delete karta hai'],
    [/\bupdates\b/gi,       'update karta hai'],
    [/\bfetches\b/gi,       'fetch karta hai'],
    [/\bscans\b/gi,         'scan karta hai'],
    [/\bregisters\b/gi,     'register karta hai'],
    [/\binitialized\b/gi,   'initialize hota hai'],
    [/\bdestroyed\b/gi,     'destroy hota hai'],
    [/\bconfigured\b/gi,    'configure kiya jaata hai'],
    [/\binjection\b/gi,     'injection (dalna)'],
    [/\bapplication\b/gi,   'application'],
    [/\bframework\b/gi,     'framework (ek dhanccha)'],
    [/\blibrary\b/gi,       'library (ready-made code)'],
    [/\bmodule\b/gi,        'module (section)'],
    [/\bpackage\b/gi,       'package (code ka group)'],
    [/\bproject\b/gi,       'project'],
    [/\bserver\b/gi,        'server'],
    [/\bclient\b/gi,        'client'],
    [/\bport\b/gi,          'port'],
    [/\bURL\b/gi,           'URL (web address)'],
    [/\bHTTP\b/gi,          'HTTP (web protocol)'],
    [/\bJSON\b/gi,          'JSON (data format)'],
    [/\bXML\b/gi,           'XML (ek aur data format)'],

    // ── Sentence endings → Hinglish ────────────────────────────────
    [/\. This /g,    '. Yeh '],
    [/\. The /g,     '. Yeh '],
    [/\. It /g,      '. Yeh '],
    [/\. A /g,       '. Ek '],
    [/\. An /g,      '. Ek '],
    [/\. In /g,      '. Isme '],
  ];

  /**
   * Converts English text to Hinglish.
   * Returns original text if isHinglish is false.
   */
  translate(text: string | null | undefined): string {
    if (!text) return text ?? '';
    if (!this.isHinglish) return text;

    let out = text;
    for (const [pattern, replacement] of this.dict) {
      out = out.replace(pattern, replacement);
    }

    // Add Hinglish ending to sentences
    out = out.replace(/\.\s*$/g, ' — samjhe? 😊');
    // Wrap first sentence with "Dekhte hain:"
    if (out.length > 60 && !out.startsWith('Dekhte')) {
      out = 'Dekhte hain — ' + out;
    }

    return out;
  }

  /** Translate an array of strings */
  translateArr(arr: string[]): string[] {
    return arr.map(s => this.translate(s));
  }
}
