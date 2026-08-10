import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ApiService, GraphData, GraphNode, GraphEdge } from '../../core/services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-graph-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel p-6 flex flex-col gap-4 h-[calc(100vh-120px)] relative">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold tracking-wide neon-text-green">Knowledge Graph Map</h2>
          <p class="text-xs text-gray-400">Interactive visual dependency map of Spring & Java topics. Drag to pan, scroll to zoom, click to study.</p>
        </div>
        <button (click)="resetZoom()" class="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:border-green-400/50 hover:bg-white/10 transition-all">
          Reset View
        </button>
      </div>

      <!-- Graph Container -->
      <div class="flex-grow w-full relative bg-[#04060d]/80 rounded-xl border border-white/5 overflow-hidden" #graphContainer>
        <svg #svgElement class="w-full h-full cursor-grab active:cursor-grabbing"></svg>
        
        <!-- Legend Overlay -->
        <div class="absolute bottom-4 left-4 bg-black/60 border border-white/10 rounded-lg p-3 text-[10px] flex flex-col gap-1.5 backdrop-blur-md">
          <div class="font-bold text-gray-400 uppercase tracking-wider mb-1">Modules</div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#00ff9d] inline-block"></span>
            <span class="text-gray-300">Fundamentals & Annotations</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#00d4ff] inline-block"></span>
            <span class="text-gray-300">Spring Boot & Microservices</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#ff6b35] inline-block"></span>
            <span class="text-gray-300">Java Core, Concurrency & JVM</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#ffea00] inline-block"></span>
            <span class="text-gray-300">SQL & Database</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class GraphViewer implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('graphContainer') graphContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('svgElement') svgElement!: ElementRef<SVGSVGElement>;

  private simulation: any;
  private zoomBehavior: any;
  private svgGroup: any;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadGraph();
  }

  ngOnDestroy() {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  private loadGraph() {
    this.apiService.getFullGraph().subscribe({
      next: (data) => {
        this.renderGraph(data);
      },
      error: (err) => {
        console.error('Failed to fetch graph data', err);
      }
    });
  }

  private renderGraph(graphData: GraphData) {
    const container = this.graphContainer.nativeElement;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const svg = d3.select(this.svgElement.nativeElement);
    svg.selectAll('*').remove(); // Clear previous rendering

    this.svgGroup = svg.append('g');

    // Add marker for arrowheads
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20) // Position arrowhead along edge
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'rgba(255, 255, 255, 0.15)');

    // Zoom behavior
    this.zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        this.svgGroup.attr('transform', event.transform);
      });
    svg.call(this.zoomBehavior);

    // Forces configuration
    this.simulation = d3.forceSimulation(graphData.nodes as any)
      .force('link', d3.forceLink(graphData.edges as any).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.val + 10));

    // Render edges/links
    const link = this.svgGroup.append('g')
      .selectAll('line')
      .data(graphData.edges)
      .enter()
      .append('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.08)')
      .attr('stroke-width', (d: any) => Math.max(1, d.weight))
      .attr('marker-end', 'url(#arrow)');

    // Render nodes
    const node = this.svgGroup.append('g')
      .selectAll('.node')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', (event, d: any) => {
          if (!event.active) this.simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d: any) => {
          if (!event.active) this.simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Draw circles representing topics
    node.append('circle')
      .attr('r', (d: any) => d.val)
      .attr('fill', (d: any) => this.getNodeColor(d.module))
      .attr('stroke', 'rgba(255,255,255,0.2)')
      .attr('stroke-width', 1.5)
      .attr('class', 'transition-all hover:scale-125 cursor-pointer')
      .style('filter', (d: any) => `drop-shadow(0 0 6px ${this.getNodeColor(d.module)})`)
      .on('click', (event: any, d: any) => {
        this.router.navigate(['/topic', d.id]);
      });

    // Add labels to nodes
    node.append('text')
      .text((d: any) => d.label)
      .attr('dx', (d: any) => d.val + 6)
      .attr('dy', 4)
      .attr('fill', '#cbd5e1')
      .style('font-size', '10px')
      .style('pointer-events', 'none')
      .style('font-weight', '500');

    // Simulation ticks mapping
    this.simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });
  }

  private getNodeColor(moduleSlug: string): string {
    if (!moduleSlug) return '#94a3b8';
    if (moduleSlug.includes('fundamentals') || moduleSlug.includes('annotations')) {
      return '#00ff9d'; // Green
    }
    if (moduleSlug.includes('spring-boot') || moduleSlug.includes('microservices')) {
      return '#00d4ff'; // Blue
    }
    if (moduleSlug.includes('collections') || moduleSlug.includes('new-features') || moduleSlug.includes('concurrency') || moduleSlug.includes('jvm')) {
      return '#ff6b35'; // Orange
    }
    if (moduleSlug.includes('sql') || moduleSlug.includes('database')) {
      return '#ffea00'; // Yellow
    }
    return '#a855f7'; // Default Purple
  }

  resetZoom() {
    if (this.zoomBehavior && this.svgElement) {
      d3.select(this.svgElement.nativeElement)
        .transition()
        .duration(750)
        .call(this.zoomBehavior.transform, d3.zoomIdentity);
    }
  }
}
