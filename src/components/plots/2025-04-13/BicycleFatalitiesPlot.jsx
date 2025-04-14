import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
// Removed motion, AnimatePresence - they are now in Tooltip.jsx
import Tooltip from '../../Tooltip'; // Import the Tooltip component (adjust path if needed!)

// --- Define constants outside the component ---
const containerHeight = 450;
// Define margin outside so it's stable and doesn't need to be in useEffect deps
const margin = { top: 50, right: 30, bottom: 150, left: 60 };
const stackKeys = [
  'Males_under_20',
  'Females_under_20',
  'Males_over_20',
  'Females_over_20',
];
const percentageKeys = stackKeys.map((key) => `${key}_pct`);
const colorScale = d3
  .scaleOrdinal()
  .domain(stackKeys)
  .range(d3.schemeCategory10);

// --- Main Component ---

const BicycleFatalitiesPlot = () => {
  // State Hooks
  const [data, setData] = useState(null);
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for DOM elements
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // --- Data Loading Function (Triggered by Click) ---
  const handleLoadDataClick = useCallback(async () => {
    // Prevent re-loading if data is already visible or currently loading
    if (isDataVisible || loading) {
      console.log('Data already visible or loading, click ignored.');
      return;
    }

    // Set loading state and clear errors/previous data
    setLoading(true);
    setError(null);
    setData(null);

    // Ensure this path points to your CSV in the public directory
    const dataPath = '/assets/data/2025-03-13/annual-bicycle-fatalities.csv';
    console.log(`Attempting to load data from: ${dataPath}`);

    try {
      // Fetch and parse CSV data
      const csvData = await d3.csv(dataPath);
      console.log('Raw CSV Data:', csvData);

      if (!csvData) throw new Error('CSV data failed to load.');
      if (csvData.length === 0) {
        setData([]);
        setError(null);
        setIsDataVisible(true);
        setLoading(false);
        return;
      }

      // Parse data, converting strings to numbers and handling potential errors
      const parsedData = csvData
        .map((d) => {
          const row = { Year: Number(String(d.Year).trim()) };
          let hasNaN = isNaN(row.Year);

          // Parse stack keys (counts)
          stackKeys.forEach((key) => {
            const rawValue = d[key]
              ? String(d[key]).trim().replace(/,/g, '')
              : null; // Remove commas
            row[key] =
              rawValue === null || rawValue === '' ? NaN : Number(rawValue);
            if (isNaN(row[key])) hasNaN = true;
          });

          // Parse percentage keys
          percentageKeys.forEach((key) => {
            const rawValue = d[key] ? String(d[key]).trim() : null;
            row[key] =
              rawValue === null || rawValue === '' ? NaN : Number(rawValue);
            // Don't invalidate row based on missing percentage, but log it
            if (isNaN(row[key]))
              console.warn(
                `Percentage parsing issue in row for key ${key}:`,
                d
              );
          });

          // Parse Total
          const rawTotal = d.Total
            ? String(d.Total).trim().replace(/,/g, '')
            : null; // Remove commas
          row.Total =
            rawTotal === null || rawTotal === '' ? NaN : Number(rawTotal);
          if (isNaN(row.Total)) hasNaN = true;

          if (hasNaN) {
            console.warn(
              'Parsing issue or invalid numeric data found in row:',
              d
            );
          }
          // Only return row if essential numeric fields (Year, counts, Total) are valid numbers
          return !hasNaN ? row : null;
        })
        .filter((d) => d !== null); // Filter out rows that had null returned due to NaN

      console.log('Parsed & Filtered Data:', parsedData);

      // Check if any valid data remains after filtering
      if (parsedData.length === 0) {
        throw new Error(
          'No valid data points remain after parsing and filtering. Check CSV format and console warnings.'
        );
      }

      // Check if domains can be calculated (ensures min/max found valid numbers)
      const yearDomain = d3.extent(parsedData, (d) => d.Year);
      const totalMax = d3.max(parsedData, (d) => d.Total);

      if (yearDomain.includes(undefined) || totalMax === undefined) {
        throw new Error(
          'Failed to calculate valid data domains. Check filtered data.'
        );
      }
      console.log('Calculated Domains (for reference):', {
        yearDomain,
        totalMax,
      });

      // Set state on successful load and parse
      setData(parsedData);
      setIsDataVisible(true);
      setError(null);
    } catch (err) {
      // Handle errors during fetch/parse
      console.error('Error loading or parsing data:', err);
      setError(err.message || `Failed to load data.`);
      setData(null);
      setIsDataVisible(false);
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
    // Added missing dependencies to satisfy exhaustive-deps rule
  }, [isDataVisible, loading, stackKeys, percentageKeys]);

  // --- D3 Rendering Effect ---
  useEffect(() => {
    const container = containerRef.current; // Get the container element
    if (!container) return;
    const containerWidth = container.offsetWidth;
    if (!containerWidth) return;

    // Calculate actual drawing dimensions based on container and margins
    // Uses margin defined outside the component
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Exit if calculated dimensions are invalid
    if (width <= 0 || height <= 0) {
      d3.select(svgRef.current).selectAll('*').remove();
      return;
    }

    // --- Scales ---
    let xDomain;
    // Calculate xDomain from data if visible, otherwise use default
    if (isDataVisible && Array.isArray(data) && data.length > 0) {
      xDomain = d3.extent(data, (d) => d.Year);
    } else {
      xDomain = [1975, 2022]; // Default estimated year range
    }
    // Calculate yDomain max based on data if visible, otherwise default
    const yMaxDomain =
      isDataVisible && Array.isArray(data) && data.length > 0
        ? d3.max(data, (d) => d.Total) * 1.05
        : 1200; // Default max Y
    const yDomain = [0, yMaxDomain];

    // Create scale functions
    const x = d3.scaleLinear().domain(xDomain).range([0, width]);
    const y = d3.scaleLinear().domain(yDomain).range([height, 0]).nice(); // Use .nice() for better axis ticks

    // --- SVG Setup ---
    // Select the SVG element, set dimensions
    const svg = d3
      .select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight);
    // Clear previous SVG content before drawing
    svg.selectAll('*').remove();
    // Append a 'g' element for the main chart area, applying margins
    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`); // Use margin from outside

    // --- Draw Axes ---
    // Append and call axis generators
    chartGroup
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')));
    chartGroup.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

    // --- Draw Text Elements (Titles, Labels, Source, Legend) ---
    // Use margin from outside for positioning calculations
    chartGroup
      .append('text')
      .attr('class', 'main-title')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2 - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '1.2rem')
      .style('font-weight', 'bold')
      .text('Number of Annual Bicyclist Fatalities');
    chartGroup
      .append('text')
      .attr('class', 'subtitle')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2 + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '0.9rem')
      .style('fill', '#444')
      .text(
        'Number of recorded bicyclists killed in fatal crashes from 1975 to 2022'
      );
    chartGroup
      .append('text')
      .attr('class', 'y-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Total Bicyclist Deaths')
      .style('font-size', '0.9rem')
      .style('fill', '#333');
    chartGroup
      .append('text')
      .attr('class', 'x-label')
      .attr('transform', `translate(${width / 2}, ${height + 30})`)
      .style('text-anchor', 'middle')
      .text('Year')
      .style('font-size', '0.9rem')
      .style('fill', '#333');
    // Legend drawing
    const legendY = height + 55;
    const legendPadding = 5;
    const legendRectSize = 15;
    const legendSpacing = 10;
    const legendGroup = chartGroup
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, ${legendY})`);
    let currentLegendX = 0;
    stackKeys.forEach((key) => {
      const labelText = key.replace(/_/g, ' ');
      const itemGroup = legendGroup
        .append('g')
        .attr('transform', `translate(${currentLegendX}, 0)`);
      itemGroup
        .append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('fill', colorScale(key));
      const textElement = itemGroup
        .append('text')
        .attr('x', legendRectSize + legendPadding)
        .attr('y', legendRectSize / 2)
        .attr('dy', '0.35em')
        .style('font-size', '0.8rem')
        .style('fill', '#333')
        .text(labelText);
      currentLegendX +=
        legendRectSize +
        legendPadding +
        textElement.node().getComputedTextLength() +
        legendSpacing;
    });
    const legendWidth = currentLegendX - legendSpacing;
    const legendStartX = (width - legendWidth) / 2;
    legendGroup.attr(
      'transform',
      `translate(${legendStartX > 0 ? legendStartX : 0}, ${legendY})`
    );
    // Source text drawing
    const sourceTextY = height + 90;
    const sourceText = chartGroup
      .append('text')
      .attr('class', 'source-text')
      .attr('x', 0)
      .attr('y', sourceTextY)
      .attr('text-anchor', 'start')
      .style('font-size', '0.75rem')
      .style('fill', '#666');
    sourceText
      .append('tspan')
      .text(
        'Data from 1975 until 1990 comes IIHS. Data from 1990 until 2006 from the Bureau of Transportation Statistics.'
      );
    sourceText
      .append('tspan')
      .attr('x', 0)
      .attr('dy', '1.2em')
      .text(
        "Data from 2007 until 2021 comes from NHTSA's Fatality and Injury Reporting System Tool (FIRST)"
      );
    sourceText
      .append('tspan')
      .attr('x', 0)
      .attr('dy', '1.2em')
      .text(
        'Chart: The League of American Bicyclists • Source: IIHS, BTS, and NHTSA FARS'
      );
    sourceText
      .append('tspan')
      .attr('x', 0)
      .attr('dy', '1.2em')
      .text('Original created with Datawrapper. Replicated here with D3.js');

    // --- Draw Stacked Areas (Conditional) ---
    if (isDataVisible && Array.isArray(data) && data.length > 0) {
      // Stack generator
      const stackGenerator = d3
        .stack()
        .keys(stackKeys) // Use keys defined outside
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);
      // Generate stacked data series
      const stackedData = stackGenerator(data);
      // Area generator function
      const areaGenerator = d3
        .area()
        .x((d) => x(d.data.Year))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]));

      // Draw the areas
      chartGroup
        .selectAll('.stack-area')
        .data(stackedData)
        .enter()
        .append('path')
        .attr('class', 'stack-area')
        .attr('d', areaGenerator)
        .attr('fill', (d) => colorScale(d.key)) // Use color scale defined outside
        .attr('opacity', 0.8);

      // --- Interaction Elements (Hover Line & Overlay) ---
      const bisector = d3.bisector((d) => d.Year).left; // Helper to find closest data point index
      // Append hover line (initially hidden)
      const hoverLine = chartGroup
        .append('line')
        .attr('class', 'hover-line')
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#333')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .style('opacity', 0);

      // Append overlay rectangle for capturing mouse events
      chartGroup
        .append('rect')
        .attr('class', 'interaction-overlay')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mousemove', (event) => {
          // Get mouse coordinates relative to chart and container
          const [pointerXRelChart] = d3.pointer(event);
          const [pointerXRelContainer, pointerYRelContainer] = d3.pointer(
            event,
            container
          ); // Use container ref

          // Find closest data point based on mouse x-position
          const yearValue = x.invert(pointerXRelChart);
          const index = bisector(data, yearValue, 1);
          const d0 = data[index - 1];
          const d1 = data[index];
          const closestData =
            d1 && yearValue - d0.Year > d1.Year - yearValue ? d1 : d0;

          // Update tooltip and hover line if closest data found
          if (closestData) {
            setTooltipData(closestData);
            const tooltipOffsetX = 15;
            const tooltipOffsetY = -35;
            setTooltipPosition({
              x: pointerXRelContainer + tooltipOffsetX,
              y: pointerYRelContainer + tooltipOffsetY,
            }); // Use container-relative coords
            const hoverX = x(closestData.Year);
            hoverLine.attr('x1', hoverX).attr('x2', hoverX).style('opacity', 1); // Show and position line
          } else {
            setTooltipData(null);
            hoverLine.style('opacity', 0); // Hide line if no data point found
          }
        });
      // Note: mouseleave handled by the container div's onMouseLeave
    }

    // Dependencies for the D3 rendering effect
    // Added margin values since they are used in calculations inside the effect
    // (Alternatively, calculate width/height/positions outside and pass them in,
    // or ensure margin object reference is stable via useMemo if defined in component)
  }, [
    data,
    isDataVisible,
    loading,
    error,
    containerHeight,
    stackKeys,
    colorScale,
  ]);

  // --- Component Event Handlers ---
  // Hides tooltip and line when mouse leaves the main container
  const handleMouseLeaveContainer = useCallback(() => {
    setTooltipData(null);
    // Select and hide the D3 hover line using its class and the SVG ref
    d3.select(svgRef.current).select('.hover-line').style('opacity', 0);
  }, []); // Empty dependency array is correct as it doesn't depend on props/state

  // --- Component Render ---
  return (
    <div
      ref={containerRef} // Attach ref to the main container div
      style={{
        position: 'relative', // Needed for positioning overlays and tooltip
        width: '100%',
        maxWidth: '800px',
        margin: '1em auto',
        minHeight: containerHeight,
        cursor: !isDataVisible && !loading ? 'pointer' : 'default', // Pointer cursor when clickable
      }}
      onClick={handleLoadDataClick} // Load data on click
      onMouseLeave={handleMouseLeaveContainer} // Hide tooltip/line on leave
    >
      {/* Conditional Overlays for Loading, Error, Click Prompt */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(255,255,255,0.8)',
            zIndex: 5,
          }}
        >
          {' '}
          Loading Chart Data...{' '}
        </div>
      )}
      {error && (
        <div
          style={{
            position: 'absolute',
            inset:
              margin.top +
              'px ' +
              margin.right +
              'px ' +
              margin.bottom +
              'px ' +
              margin.left +
              'px',
            display: 'grid',
            placeItems: 'center',
            color: 'red',
            background: 'rgba(255,255,255,0.8)',
            zIndex: 5,
            padding: '1em',
            borderRadius: '5px',
          }}
        >
          {' '}
          Error: {error}{' '}
        </div>
      )}
      {!loading && !error && !isDataVisible && (
        <div
          style={{
            position: 'absolute',
            top: margin.top,
            left: margin.left,
            width: `calc(100% - ${margin.left + margin.right}px)`,
            height: `calc(100% - ${margin.top + margin.bottom}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            backgroundColor: 'rgba(248, 248, 248, 0.7)',
            textAlign: 'center',
            borderRadius: '3px',
            zIndex: 4,
          }}
        >
          {' '}
          Click to load chart data{' '}
        </div>
      )}
      {!loading && !error && isDataVisible && data && data.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2em' }}>
          {' '}
          No data available to display chart.{' '}
        </div>
      )}

      {/* SVG container where D3 will draw */}
      <svg
        ref={svgRef}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          minHeight: containerHeight,
        }}
      />

      {/* Tooltip Component */}
      <Tooltip
        x={tooltipPosition.x}
        y={tooltipPosition.y}
        data={tooltipData}
        isVisible={!!tooltipData}
        keys={stackKeys} // Pass stackKeys
        colorScale={colorScale} // Pass colorScale
      />
    </div>
  );
};

export default BicycleFatalitiesPlot;
