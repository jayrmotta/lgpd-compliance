import React from 'react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './pagination';

export function PaginationDemo() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Pagination Component Examples</h2>
        <p className="text-muted-foreground mb-6">
          Various examples of the Pagination component in different use cases.
        </p>
      </div>

      {/* Basic Pagination */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Basic Pagination</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Pagination with Ellipsis */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Pagination with Ellipsis</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Large Pagination Set */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Large Pagination Set</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>6</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">7</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">8</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">20</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Disabled Previous Button */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Disabled Previous Button (First Page)</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" aria-disabled="true" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Disabled Next Button */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Disabled Next Button (Last Page)</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" aria-disabled="true" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Compact Pagination */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Compact Pagination</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Single Page Pagination */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Single Page Pagination</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Custom Styled Pagination */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Custom Styled Pagination</h3>
        <Pagination className="border rounded-lg p-4 bg-muted/50">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="bg-background" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive className="bg-primary text-primary-foreground">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="bg-background hover:bg-accent">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="bg-background hover:bg-accent">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="bg-background" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Interactive Pagination Example */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Interactive Pagination (Click to see console logs)</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Previous page clicked');
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink 
                href="#" 
                isActive
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Page 1 clicked (current)');
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Page 2 clicked');
                }}
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Page 3 clicked');
                }}
              >
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Next page clicked');
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
